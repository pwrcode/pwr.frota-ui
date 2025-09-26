import { ativoOptions } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectStatus = (props: Props) => {
    const {
        name = "ativo",
        title = "Status",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={ativoOptions}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectStatus