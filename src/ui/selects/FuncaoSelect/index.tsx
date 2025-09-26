import { optionsFuncoes } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectFuncao = (props: Props) => {
    const {
        name = "optionsFuncoes",
        title = "Função",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={optionsFuncoes}
            value={value}
            setValue={onChange}
            isMulti
        />
    )
}

export default SelectFuncao