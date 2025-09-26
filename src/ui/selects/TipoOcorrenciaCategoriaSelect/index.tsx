import { getTipoOcorrenciaCategoriaList } from "@/services/tipoOcorrenciaCategoria";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectTipoOcorrenciaCategoria = (props: Props) => {
    const {
        name = "idVeiculo",
        title = "Veículo",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getTiposOcorrenciaCategoria();
    }, []);

    const getTiposOcorrenciaCategoria = async (pesquisa?: string) => {
        const data = await getTipoOcorrenciaCategoriaList(pesquisa);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getTiposOcorrenciaCategoria}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectTipoOcorrenciaCategoria