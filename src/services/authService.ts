import { RegisteredUser } from "../types";
import { bufferToImageSrc } from "./categoryService";
import { apiRequest, setSessionTokens, clearSessionTokens, ApiError } from "./apiClient";

export interface UserInfoHdrRow {
  user_code: string;
  user_name?: string;
  first_name?: string;
  last_name?: string;
  email_id: string;
  user_status?: string;
  user_type?: string;
  role_id?: string | number;
  super_admin?: string;
  company_code?: string;
  dob?: string;
  gender?: string;
  user_images?: { type?: string; data?: number[] } | string | null;
}

interface LoginApiResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: UserInfoHdrRow;
}

export async function loginUserByEmail(
  email: string,
  password: string,
  companyCode = ""
): Promise<{ success: boolean; message: string; user?: RegisteredUser }> {
  try {
    const data = await apiRequest<LoginApiResponse>("/loginWithEmail", {
      method: "POST",
      requiresAuth: false,
      skipRefreshOn401: true,
      body: JSON.stringify({
        email_id: email.trim(),
        user_password: password,
        company_code: companyCode,
      }),
    });

    if (!data?.success || !data?.user) {
      return {
        success: false,
        message: data?.message || "Invalid Email ID or Password",
      };
    }

    if (data.accessToken) {
      setSessionTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresIn ? Date.now() + Number(data.expiresIn) * 1000 : undefined,
      });
    }

    const row = data.user;
    const roleStr = String(row.role_id ?? "").trim().toLowerCase();
    const isAdminUser =
      row.super_admin?.trim().toLowerCase() === "yes" ||
      roleStr === "ad" ||
      roleStr === "admin" ||
      roleStr === "1";

    const fullName =
      row.user_name?.trim() ||
      [row.first_name?.trim(), row.last_name?.trim()].filter(Boolean).join(" ") ||
      row.user_code;

    const imgSrc = bufferToImageSrc(row.user_images);

    const mappedUser: RegisteredUser = {
      id: row.user_code?.trim() || row.email_id,
      name: fullName,
      email: row.email_id?.trim() || email.trim(),
      phone: "",
      password: "",
      avatar: imgSrc ||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      memberSince: row.company_code?.trim() || "AURA Member",
      tier: isAdminUser ? "Diamond VIP" : "Standard",
      role: isAdminUser ? "admin" : "customer",
      totalOrders: 0,
      totalSpent: 0,
      status: "Active",
    };

    return {
      success: true,
      message: "Signed in successfully",
      user: mappedUser,
    };
  } catch (err) {
    const apiErr = err as ApiError;
    return {
      success: false,
      message: apiErr?.message || "Unable to connect to authentication server",
    };
  }
}

export async function logoutUserApi(): Promise<void> {
  try {
    await apiRequest("/logoutUser", {
      method: "POST",
      requiresAuth: false,
      skipRefreshOn401: true,
    });
  } catch {
    // ignore logout network errors
  } finally {
    clearSessionTokens();
  }
}