import { getUfList } from "@/services/uf";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
    size?: string
}

const SelectUf = (props: Props) => {
    const {
        name = "idUf",
        title = "UF",
        control,
        size
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getUfs();
    }, []);

    const getUfs = async (pesquisa?: string) => {
        const data = await getUfList(pesquisa);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getUfs}
            value={value}
            setValue={onChange}
            isClearable
            size={size}
        />
    )
}

export default SelectUf