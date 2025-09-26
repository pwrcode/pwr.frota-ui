import { tiposDataVeiculo } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectTipoDataVeiculo = (props: Props) => {
    const {
        name = "tipoData",
        title = "Tipo Data",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={tiposDataVeiculo}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectTipoDataVeiculo