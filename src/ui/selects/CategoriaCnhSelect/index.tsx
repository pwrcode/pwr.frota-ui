import { categoriasCnh } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectCategoriaCnh = (props: Props) => {
    const {
        name = "cnhCategoria",
        title = "CNH Categoria",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={categoriasCnh}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectCategoriaCnh