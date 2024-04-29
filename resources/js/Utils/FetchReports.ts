import axios, { AxiosResponse } from "axios";
import { SendResourceRequest } from "./helpers";
import { IUserAuthorityControl } from "@/types";

type JsonCallback = (response: Array<object>) => void;

const { privileges, selectedBranch } = {
    privileges: JSON.parse(
        (localStorage.getItem("privileges") as any) || {},
    ) as IUserAuthorityControl,
    selectedBranch: Number(localStorage.getItem("selectedBranch")),
};

const getJournalEntries = async (
    filter: {
        transactionType: string;
        search: string;
        start_date: string;
        end_date: string;
        currency: Array<any>;
        till: null | number;
    },
    callback: JsonCallback,
    is_paginate: boolean = true,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "FinancialResources",
                    _method_name: "get_journal_entries",
                },
                {
                    t: filter.transactionType,
                    se: filter.search,
                    sd: filter.start_date.replaceAll("/", "-").trim(),
                    ed: filter.end_date.replaceAll("/", "-").trim(),
                    ti: filter.till,
                    c: filter.currency,
                    is_paginate,
                },
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

const getCustomerLedger = async (
    filter: {
        customer: null | {
            id: number;
            name: string;
            branch_id: number;
        };
        search: string;
        start_date: string;
        end_date: string;
        currency: Array<any>;
    },
    callback: JsonCallback,
    is_paginate: boolean = true,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "HRResources",
                    _method_name: "get_customer_ledger",
                },
                {
                    cu: filter.customer?.id ?? 0,
                    se: filter.search,
                    sd: filter.start_date.replaceAll("/", "-").trim(),
                    ed: filter.end_date.replaceAll("/", "-").trim(),
                    c: filter.currency,
                    is_paginate,
                },
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

const getProceedVisaReport = async (
    filter: {
        customer: null | {
            id: number;
            name: string;
            branch_id: number;
        };
        search: string;
        start_date: string;
        end_date: string;
        type: string | null;
        currency: Array<any>;
    },
    callback: JsonCallback,
    is_paginate: boolean = true,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "VisaResources",
                    _method_name: "get_proceed_visa_report",
                },
                {
                    c: filter.customer?.id ?? 0,
                    se: filter.search,
                    sd: filter.start_date.replaceAll("/", "-").trim(),
                    ed: filter.end_date.replaceAll("/", "-").trim(),
                    cu: filter.currency,
                    type: filter.type,
                    branch_id: selectedBranch,
                    is_show_other_branches_data:
                        privileges.misc.other_branches_control,
                    is_paginate,
                },
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

const getEmployeeLedger = async (
    filter: {
        employee: null | {
            id: number;
            name: string;
            branch_id: number;
        };
        search: string;
        start_date: string;
        end_date: string;
        currency: Array<any>;
    },
    callback: JsonCallback,
    is_paginate: boolean = true,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "HRResources",
                    _method_name: "get_employee_ledger",
                },
                {
                    em: filter.employee?.id ?? 0,
                    se: filter.search,
                    sd: filter.start_date.replaceAll("/", "-").trim(),
                    ed: filter.end_date.replaceAll("/", "-").trim(),
                    c: filter.currency,
                    is_paginate,
                },
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

const getCommitedVisas = async (
    filter: any,
    callback: JsonCallback,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "VisaResources",
                    _method_name: "get_commited_visa_report",
                },
                {},
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

const getBankLedger = async (
    filter: {
        bank: null | {
            id: number;
            name: string;
            branch_id: number;
        };
        search: string;
        start_date: string;
        end_date: string;
        currency: Array<any>;
    },
    callback: JsonCallback,
    is_paginate: boolean = true,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "FinancialResources",
                    _method_name: "get_bank_ledger",
                },
                {
                    ba: filter.bank?.id ?? 0,
                    se: filter.search,
                    sd: filter.start_date.replaceAll("/", "-").trim(),
                    ed: filter.end_date.replaceAll("/", "-").trim(),
                    c: filter.currency,
                    is_paginate,
                },
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

const getEICodeLedger = async (
    filter: {
        code: null | {
            id: number;
            name: string;
        };
        search: string;
        start_date: string;
        end_date: string;
        currency: Array<any>;
    },
    callback: JsonCallback,
    is_paginate: boolean = true,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "FinancialResources",
                    _method_name: "get_code_ledger",
                },
                {
                    code: filter.code?.id ?? 0,
                    se: filter.search,
                    sd: filter.start_date.replaceAll("/", "-").trim(),
                    ed: filter.end_date.replaceAll("/", "-").trim(),
                    c: filter.currency,
                    is_paginate,
                },
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

const getJournalBalancies = async (
    filter: {
        currency: null | number;
        till: null | number;
        start_date: string;
        end_date: string;
    },
    callback: JsonCallback,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "FinancialResources",
                    _method_name: "get_journal_balancies",
                },
                {
                    ti: filter.till,
                    c: filter.currency,
                    sd: filter.start_date.replaceAll("/", "-").trim(),
                    ed: filter.end_date.replaceAll("/", "-").trim(),
                },
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

const getTillOpenCloseBalancies = async (
    id: number,
    callback: JsonCallback,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "FinancialResources",
                    _method_name: "get_till_opening_close",
                },
                {
                    id,
                },
            ),
        )
        .then((Response: AxiosResponse<Array<any>>): void => {
            callback(Response.data);
        });
};

const getLoansReport = async (
    filter: {
        branch: null | {
            id: number;
            name: string;
        };
        search: string;
        type: string;
        currency: Array<any>;
    },
    callback: JsonCallback,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "FinancialResources",
                    _method_name: "get_loans_report",
                },
                {
                    b: filter.branch?.id ?? 0,
                    se: filter.search,
                    t: filter.type,
                    c: filter.currency,
                },
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

export {
    getJournalEntries,
    getCustomerLedger,
    getProceedVisaReport,
    getJournalBalancies,
    getEmployeeLedger,
    getTillOpenCloseBalancies,
    getBankLedger,
    getEICodeLedger,
    getLoansReport,
    getCommitedVisas,
};
