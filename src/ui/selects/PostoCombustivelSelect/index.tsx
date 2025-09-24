import { getPostoCombustivelList } from "@/services/postoCombustivel";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectPostoCombustivel = (props: Props) => {
    const {
        name = "idPostoCombustivel",
        title = "Posto Combustível",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getPostosCombustivel();
    }, []);

    const getPostosCombustivel = async (pesquisa?: string) => {
        const data = await getPostoCombustivelList(pesquisa, undefined, undefined, undefined, undefined);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getPostosCombustivel}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectPostoCombustivel