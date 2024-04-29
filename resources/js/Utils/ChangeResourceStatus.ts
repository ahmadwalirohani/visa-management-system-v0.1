import axiosInstance from "@/Pages/Plugins/axiosIns";

interface IParameters {
    model: string;
    id: number;
    status: boolean | number;
    afterChange(): void;
    onSend(): void;
}

export default function (resource: IParameters): void {
    resource.onSend();

    axiosInstance
        .post("/change_resource_status", {
            id: resource.id,
            model: resource.model,
            status: resource.status,
        })
        .then((): void => {
            resource.afterChange();
        });
}
