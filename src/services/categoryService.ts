import { config } from '../ApiConfig';
import { Category } from '../types';

export interface CategoryMasterApiRow {
    Item_Category_Code: string;
    Item_Category_Name: string;
    Item_Category_Image?: {
        type?: string;
        data?: number[];
    } | string | null;
}

const DEFAULT_CATEGORY_IMAGE =
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80';

export function bufferToImageSrc(
    imageData: CategoryMasterApiRow['Item_Category_Image']
): string {
    if (!imageData) return DEFAULT_CATEGORY_IMAGE;

    if (typeof imageData === 'string') {
        if (
            imageData.startsWith('data:image') ||
            imageData.startsWith('http://') ||
            imageData.startsWith('https://')
        ) {
            return imageData;
        }
        return `data:image/jpeg;base64,${imageData}`;
    }

    const bytes = Array.isArray(imageData.data) ? imageData.data : [];
    if (bytes.length === 0) return DEFAULT_CATEGORY_IMAGE;

    const uint8 = new Uint8Array(bytes);
    let mimeType = 'image/jpeg';

    // PNG signature: 89 50 4E 47
    if (uint8[0] === 0x89 && uint8[1] === 0x50 && uint8[2] === 0x4e && uint8[3] === 0x47) {
        mimeType = 'image/png';
    }
    // WebP signature: RIFF .... WEBP
    else if (
        uint8[0] === 0x52 &&
        uint8[1] === 0x49 &&
        uint8[2] === 0x46 &&
        uint8[3] === 0x46 &&
        uint8[8] === 0x57 &&
        uint8[9] === 0x45 &&
        uint8[10] === 0x42 &&
        uint8[11] === 0x50
    ) {
        mimeType = 'image/webp';
    }

    // Convert Uint8Array to base64 in chunks to avoid call-stack limits
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < uint8.length; i += chunkSize) {
        binary += String.fromCharCode(...uint8.subarray(i, i + chunkSize));
    }

    return `data:${mimeType};base64,${btoa(binary)}`;
}

function toSlug(name: string, code: string): string {
    const base = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return base || code.toLowerCase();
}

export async function fetchCategoriesMaster(companyCode: string): Promise<Category[]> {
    const response = await fetch(`${config.apiBaseUrl}/getCategoriesMaster`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_code: companyCode }),
    });

    if (!response.ok) {
        throw new Error(`Failed to load categories (${response.status})`);
    }

    const rows: CategoryMasterApiRow[] = await response.json();
    if (!Array.isArray(rows)) return [];

    return rows.map((row, index) => {
        const code = row.Item_Category_Code?.trim() || `CAT-${index + 1}`;
        const name = row.Item_Category_Name?.trim() || code;

        return {
            id: code,
            name,
            slug: toSlug(name, code),
            iconName: 'Tag',
            image: bufferToImageSrc(row.Item_Category_Image),
            subcategories: [], 
            productCount: 25, 
            status: 'Active',
        };
    });
}