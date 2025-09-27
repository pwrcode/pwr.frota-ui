import { getTipoLocalizacaoList } from "@/services/tipoLocalizacao";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectTiposLocalizacao = (props: Props) => {
    const {
        name = "idTipoLocalizacao",
        title = "Tipo Localizacao",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getTiposLocalizacao();
    }, []);

    const getTiposLocalizacao = async (pesquisa?: string) => {
        const data = await getTipoLocalizacaoList(pesquisa);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getTiposLocalizacao}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectTiposLocalizacao