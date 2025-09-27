import { opcoesBandeira } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectBandeira = (props: Props) => {
    const {
        name = "bandeira",
        title = "Bandeira",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={opcoesBandeira}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectBandeira