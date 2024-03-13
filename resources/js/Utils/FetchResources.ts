import axios, { AxiosResponse } from "axios";
import { SendResourceRequest } from "./helpers";

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

export { LoadCurrencies, GetCustomerLatestID, LoadBranches, GetCustomers };
