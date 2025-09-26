import { tiposTanque } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectTipoTanque = (props: Props) => {
    const {
        name = "tipoTanque",
        title = "Tipo Tanque",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={tiposTanque}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectTipoTanque