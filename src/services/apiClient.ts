import { config } from "../ApiConfig";

export interface SessionTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
}

const TOKEN_STORAGE_KEY = "yjk_auth_tokens";

let memoryTokens: SessionTokens | null = null;
let refreshPromise: Promise<string | null> | null = null;
let onUnauthorizedCallback: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorizedCallback = handler;
}

export function getSessionTokens(): SessionTokens | null {
  if (memoryTokens) return memoryTokens;
  try {
    const raw = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    memoryTokens = JSON.parse(raw) as SessionTokens;
    return memoryTokens;
  } catch {
    return null;
  }
}

export function setSessionTokens(tokens: SessionTokens | null) {
  memoryTokens = tokens;
  try {
    if (tokens) {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    } else {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function clearSessionTokens() {
  setSessionTokens(null);
}

export function getAccessToken(): string | null {
  return getSessionTokens()?.accessToken || null;
}

function createRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const current = getSessionTokens();
    try {
      const res = await fetch(`${config.apiBaseUrl}/refreshToken`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": createRequestId(),
          "X-Client-App": "YJK-WEB",
        },
        body: JSON.stringify({ refreshToken: current?.refreshToken }),
      });

      if (!res.ok) {
        clearSessionTokens();
        return null;
      }

      const data = await res.json();
      const nextToken: string | undefined = data?.accessToken || data?.token;
      if (!nextToken) {
        clearSessionTokens();
        return null;
      }

      setSessionTokens({
        accessToken: nextToken,
        refreshToken: data?.refreshToken ?? current?.refreshToken,
        expiresAt: data?.expiresIn ? Date.now() + Number(data.expiresIn) * 1000 : current?.expiresAt,
      });

      return nextToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
  skipRefreshOn401?: boolean;
  timeoutMs?: number;
  idempotencyKey?: string;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    requiresAuth = true,
    skipRefreshOn401 = false,
    timeoutMs = 15000,
    idempotencyKey,
    headers: customHeaders,
    ...rest
  } = options;

  const executeFetch = async (tokenOverride?: string | null): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const headers = new Headers(customHeaders);
    if (!headers.has("Content-Type") && rest.body && !(rest.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("X-Request-Id", createRequestId());
    headers.set("X-Client-App", "YJK-WEB");
    headers.set("X-Client-Platform", "Web");

    if (idempotencyKey) {
      headers.set("X-Idempotency-Key", idempotencyKey);
    }

    const token = tokenOverride !== undefined ? tokenOverride : getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      return await fetch(`${config.apiBaseUrl}${endpoint}`, {
        ...rest,
        headers,
        credentials: "include",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  };

  let response = await executeFetch();

  if (response.status === 401 && requiresAuth && !skipRefreshOn401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await executeFetch(newToken);
    }
  }

  let parsedBody: unknown = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      parsedBody = await response.json();
    } catch {
      parsedBody = null;
    }
  } else {
    try {
      parsedBody = await response.text();
    } catch {
      parsedBody = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && requiresAuth) {
      clearSessionTokens();
      onUnauthorizedCallback?.();
    }

    const bodyObj =
      parsedBody && typeof parsedBody === "object"
        ? (parsedBody as Record<string, unknown>)
        : null;

    const err = new Error(
      (bodyObj?.message as string) ||
        (typeof parsedBody === "string" && parsedBody) ||
        `Request failed with status ${response.status}`
    ) as ApiError;
    err.status = response.status;
    err.code = bodyObj?.code as string | undefined;
    err.details = parsedBody;
    throw err;
  }

  return parsedBody as T;
}