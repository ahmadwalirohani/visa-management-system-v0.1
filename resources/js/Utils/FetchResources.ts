import axios, { AxiosResponse } from "axios";
import { SendResourceRequest } from "./helpers";
import { IVisaPendingFilterProps } from "@/types";

type JsonCallback = (response: Array<object>) => void;
type AnyCallBack = (response: number | string | null | boolean) => void;

async function LoadCurrencies(callback: JsonCallback): Promise<void> {
    return axios
        .get(
            SendResourceRequest({
                _class: "SettingsResources",
                _method_name: "get_currencies",
            }),
        )
        .then((Response: AxiosResponse<Array<object>>): void => {
            callback(Response.data);
        });
}

async function LoadBranches(callback: JsonCallback): Promise<void> {
    return axios
        .get(
            SendResourceRequest({
                _class: "SettingsResources",
                _method_name: "get_branches",
            }),
        )
        .then((Response: AxiosResponse<Array<object>>): void => {
            callback(Response.data);
        });
}

const GetCustomerLatestID = async (callback: AnyCallBack): Promise<void> => {
    axios
        .get(
            SendResourceRequest({
                _class: "HRResources",
                _method_name: "get_customer_latest_id",
            }),
        )
        .then((Response: AxiosResponse<number>): void => {
            callback(Response.data);
        });
};

const GetCustomers = async (callback: JsonCallback): Promise<void> => {
    axios
        .get(
            SendResourceRequest({
                _class: "HRResources",
                _method_name: "get_customers",
            }),
        )
        .then((Response: AxiosResponse<Array<object>>): void => {
            callback(Response.data);
        });
};

const GetEmployeeLatestID = async (callback: AnyCallBack): Promise<void> => {
    axios
        .get(
            SendResourceRequest({
                _class: "HRResources",
                _method_name: "get_employee_latest_id",
            }),
        )
        .then((Response: AxiosResponse<number>): void => {
            callback(Response.data);
        });
};

const GetEmployees = async (callback: JsonCallback): Promise<void> => {
    axios
        .get(
            SendResourceRequest({
                _class: "HRResources",
                _method_name: "get_employees",
            }),
        )
        .then((Response: AxiosResponse<Array<object>>): void => {
            callback(Response.data);
        });
};

const GetVisaTypes = async (callback: JsonCallback): Promise<void> => {
    axios
        .get(
            SendResourceRequest({
                _class: "SettingsResources",
                _method_name: "get_visa_types",
            }),
        )
        .then((Response: AxiosResponse<Array<object>>): void => {
            callback(Response.data);
        });
};

const GetCustomersAsItems = async (callback: JsonCallback): Promise<void> => {
    axios
        .get(
            SendResourceRequest({
                _class: "HRResources",
                _method_name: "get_customers_as_items",
            }),
        )
        .then((Response: AxiosResponse<Array<object>>): void => {
            callback(Response.data);
        });
};

const GetTillLatestID = async (callback: AnyCallBack): Promise<void> => {
    axios
        .get(
            SendResourceRequest({
                _class: "FinancialResources",
                _method_name: "get_till_latest_id",
            }),
        )
        .then((Response: AxiosResponse<number>): void => {
            callback(Response.data);
        });
};

const GetVisaLatestID = async (callback: AnyCallBack): Promise<void> => {
    axios
        .get(
            SendResourceRequest({
                _class: "VisaResources",
                _method_name: "get_visa_latest_id",
            }),
        )
        .then((Response: AxiosResponse<number>): void => {
            callback(Response.data);
        });
};

const GetTills = async (callback: JsonCallback): Promise<void> => {
    axios
        .get(
            SendResourceRequest({
                _class: "FinancialResources",
                _method_name: "get_tills",
            }),
        )
        .then((Response: AxiosResponse<Array<object>>): void => {
            callback(Response.data);
        });
};

const getNonProcessedVisas = async (callback: JsonCallback): Promise<void> => {
    axios
        .get(
            SendResourceRequest({
                _class: "VisaResources",
                _method_name: "get_non_processed_visas",
            }),
        )
        .then((Response: AxiosResponse<Array<object>>): void => {
            callback(Response.data);
        });
};

const getPendingVisas = async (
    filter: IVisaPendingFilterProps,
    callback: JsonCallback,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "VisaResources",
                    _method_name: "get_pending_visas",
                },
                {
                    c: filter.customer?.id,
                    t: filter.type,
                    s: filter.status,
                    se: filter.search,
                    b: filter.branch,
                },
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

export {
    LoadCurrencies,
    GetCustomerLatestID,
    LoadBranches,
    GetCustomers,
    GetVisaTypes,
    GetCustomersAsItems,
    GetTillLatestID,
    GetTills,
    getPendingVisas,
    GetVisaLatestID,
    getNonProcessedVisas,
    GetEmployeeLatestID,
    GetEmployees,
};
