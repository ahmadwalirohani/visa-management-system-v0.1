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
    currency: number;
    price: number;
    basic_type: string;
    visa_type: number;
    visa_entrance_type: number | null;
    name: string;
    remarks: string | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
