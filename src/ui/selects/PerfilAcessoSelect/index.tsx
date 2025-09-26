import { getPerfilAcessoList } from "@/services/perfilAcesso";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectPerfilAcesso = (props: Props) => {
    const {
        name = "idPerfilAcesso",
        title = "Perfil de Acesso",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getPerfilAcesso();
    }, []);

    const getPerfilAcesso = async (pesquisa?: string) => {
        const data = await getPerfilAcessoList(pesquisa);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getPerfilAcesso}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectPerfilAcesso