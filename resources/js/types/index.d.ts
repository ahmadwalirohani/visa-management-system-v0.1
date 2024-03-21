export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface IVisaProps {
    customer: any;
    province: string | null;
    job: string | null;
    passport_no: string;
    block_no: string | null;
    currency:
        | {
              id: number;
              symbol: string;
          }
        | number;
    price: number;
    basic_type: string;
    visa_type: number;
    visa_entrance_type: number | null;
    name: string;
    remarks: string | null;
    visa_qty: number;
    booked_date: string | null;
    ordered_date: string | null;
}

interface IPaginationLink {
    url: null | string;
    label: string;
    active: boolean;
}

export interface IPagination {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: IPaginationLink[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface IVisaPendingFilterProps {
    customer: {
        id: number;
    } | null;
    type: number;
    status: string | null;
    search: string | null;
    branch: number | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
