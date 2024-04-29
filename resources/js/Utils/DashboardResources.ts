import axios, { AxiosResponse } from "axios";
import { SendResourceRequest } from "./helpers";

type JsonCallback = (response: Array<object>) => void;

const getUserLogs = async (
    filter: any,
    callback: JsonCallback,
): Promise<void> => {
    axios
        .get(
            SendResourceRequest(
                {
                    _class: "SettingsResources",
                    _method_name: "get_user_logs_report",
                },
                {},
            ),
        )
        .then((Response: AxiosResponse): void => {
            callback(Response.data);
        });
};

export { getUserLogs };
