import { getPessoaList } from "@/services/pessoa";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectFornecedor = (props: Props) => {
    const {
        name = "idPessoaFornecedor",
        title = "Fornecedor",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getFornecedores();
    }, []);

    const getFornecedores = async (pesquisa?: string) => {
        const data = await getPessoaList(pesquisa, undefined, undefined, undefined, undefined, undefined, true, undefined, undefined, undefined);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getFornecedores}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectFornecedor