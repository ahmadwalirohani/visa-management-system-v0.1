import { SendActionRequest } from "@/Utils/helpers";
import {
    Button,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    Modal,
    ModalDialog,
    Stack,
} from "@mui/joy";
import axios from "axios";
import { useEffect, useState } from "react";
import { Calendar, CalendarProvider } from "zaman";

interface IProps {
    openState: boolean;
    setOpenState(state: boolean, is_updated: boolean): void;
    id: number;
}

function VisaBookingModel({ openState, setOpenState, id }: IProps) {
    const [useData, setData] = useState({
        booked_date: new Date(),
        visa_id: 0,
        loading: false,
    });

    const onSubmit = () => {
        setData((prevState) => ({
            ...prevState,
            loading: true,
        }));

        const Config = SendActionRequest(
            {
                _class: "VisaLogics",
                _method_name: "book_visa_status",
                _validation_class: null,
            },
            useData,
        );

        axios
            .post(Config.url, Config.payload)
            .then(() => {
                setOpenState(false, true);
            })
            .finally(() =>
                setData((prevState) => ({
                    ...prevState,
                    loading: false,
                })),
            );
    };

    useEffect(() => {
        setData((prevState) => ({
            ...prevState,
            visa_id: id,
        }));
    }, [id]);
    return (
        <>
            <Modal
                open={openState}
                onClose={() => {
                    setOpenState(false, false);
                }}
            >
                <ModalDialog>
                    <DialogTitle>ثبت نام شد</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>نوبت تاریخ</FormLabel>
                                <CalendarProvider locale="fa" round="x2">
                                    <Calendar
                                        defaultValue={useData.booked_date}
                                        onChange={({ value }) =>
                                            setData((prevState) => ({
                                                ...prevState,
                                                booked_date: value,
                                            }))
                                        }
                                        weekends={[6]}
                                    />
                                </CalendarProvider>
                            </FormControl>

                            <Button
                                loading={useData.loading}
                                onClick={() => onSubmit()}
                            >
                                ثبت
                            </Button>
                        </Stack>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </>
    );
}

export default VisaBookingModel;
