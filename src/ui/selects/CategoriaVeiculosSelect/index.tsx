import { categoriasVeiculos } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectCategoriaVeiculo = (props: Props) => {
    const {
        name = "categoriaHabilitacao",
        title = "Categoria Habilitação",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={categoriasVeiculos}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectCategoriaVeiculo