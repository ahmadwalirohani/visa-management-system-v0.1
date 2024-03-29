import axios from "axios";

interface IParameters {
    model: string;
    id: number;
    status: boolean | number;
    afterChange(): void;
    onSend(): void;
}

export default function (resource: IParameters): void {
    resource.onSend();

    axios
        .post("/change_resource_status", {
            id: resource.id,
            model: resource.model,
            status: resource.status,
        })
        .then((): void => {
            resource.afterChange();
        });
}
