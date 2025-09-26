import { tiposCorVeiculo } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectCor = (props: Props) => {
    const {
        name = "cor",
        title = "Cor",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={tiposCorVeiculo}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectCor