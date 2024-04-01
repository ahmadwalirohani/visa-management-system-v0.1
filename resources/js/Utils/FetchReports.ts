import axios, { AxiosResponse } from "axios";
import { SendResourceRequest } from "./helpers";

type JsonCallback = (response: Array<object>) => void;

const getJournalEntries = async (
    filter: {
        transactionType: string;
        search: string;
        start_date: string;
        end_date: string;
        currency: Array<any>;
        branch: null | number;
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
                    b: filter.branch,
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
export { getJournalEntries, getCustomerLedger };
