import { tiposPessoa } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectTipoPessoa = (props: Props) => {
    const {
        name = "tipoPessoa",
        title = "Tipo Pessoa",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={tiposPessoa}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectTipoPessoa