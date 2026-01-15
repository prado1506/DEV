export interface Device {
    id: number;
    name: string;
    location: string;
    purchase_date: string;
    in_use: boolean;
    user_id: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface DeviceResponse {
    current_page: number;
    data: Device[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface DeviceFilters {
    location?: string;
    in_use?: boolean | string;
    purchase_date_from?: string;
    purchase_date_to?: string;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}
