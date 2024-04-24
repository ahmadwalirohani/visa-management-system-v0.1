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

export interface IUserAuthorityControl {
    visa: {
        actions: {
            add: boolean;
            edit: boolean;
            cancel: boolean;
            add_expense: boolean;
            proceed: boolean;
            commit: boolean;
        };
        reports: {
            pending: boolean;
            proceed: boolean;
            committed: boolean;
        };
    };
    customer: {
        actions: {
            add: boolean;
            edit: boolean;
            delete: boolean;
        };
        reports: {
            list: boolean;
            ledger: boolean;
        };
    };
    employee: {
        actions: {
            add: boolean;
            edit: boolean;
            delete: boolean;
        };
        reports: {
            list: boolean;
            ledger: boolean;
        };
    };
    bank: {
        actions: {
            add: boolean;
            edit: boolean;
            delete: boolean;
        };
        reports: {
            list: boolean;
            ledger: boolean;
        };
    };
    till: {
        actions: {
            add: boolean;
            edit: boolean;
            delete: boolean;
            opening_closing: boolean;
        };
        reports: {
            list: boolean;
            open_closed: boolean;
        };
    };
    settings: {
        users: {
            add: boolean;
            edit: boolean;
            branch_control: boolean;
            list: boolean;
        };
        branches: {
            add: boolean;
            list: boolean;
        };
        ei_codes: {
            add: boolean;
            list: boolean;
        };
        system_infos: {
            add: boolean;
        };
        visa_types: {
            add: boolean;
            list: boolean;
        };
        currencies: {
            add: boolean;
            add_exchange_rate: boolean;
            list: boolean;
        };
    };
    misc: {
        add_journal_entry: boolean;
        view_journal_entries: boolean;
        user_logs: boolean;
        ei_codes_ledger: boolean;
        balance_sheet: boolean;
        loans: boolean;
        other_branches_control: boolean;
    };
}
