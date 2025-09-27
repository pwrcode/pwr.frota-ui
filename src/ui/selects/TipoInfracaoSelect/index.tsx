import { tiposInfração } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectTipoInfracao = (props: Props) => {
    const {
        name = "tipoInfracao",
        title = "Tipo Infração",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={tiposInfração}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectTipoInfracao