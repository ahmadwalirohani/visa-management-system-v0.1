import { FormControl, Input } from "@mui/joy";
import { ChangeEvent } from "react";
//import InfoOutlined from "@mui/icons-material/InfoOutlined";

interface IProps {
    validation:
        | {
              state: boolean;
              msg: string;
          }
        | boolean;
    placeHolder: string;
    name: string;
    type: string;
    value: string | null;
    readonly: boolean;
    onValChange(e: ChangeEvent<HTMLInputElement>, field: string): void;
}

const defaultProps: Partial<IProps> = {
    readonly: false,
};

function InputField({
    validation,
    placeHolder,
    name,
    value,
    type = "text",
    onValChange,
    readonly,
}: IProps) {
    return (
        <>
            <FormControl
                sx={{ mt: 2 }}
                error={
                    typeof validation == "object"
                        ? validation.state
                        : validation
                }
            >
                <Input
                    name={name}
                    type={type}
                    readOnly={!!readonly}
                    placeholder={placeHolder}
                    value={value as string}
                    onChange={(e) => onValChange(e, name)}
                />
                {/* {validation.state && (
                    <FormHelperText>
                        <InfoOutlined />
                        {validation.msg}
                    </FormHelperText>
                )} */}
            </FormControl>
        </>
    );
}

InputField.defaultProps = defaultProps as IProps;
export default InputField;
