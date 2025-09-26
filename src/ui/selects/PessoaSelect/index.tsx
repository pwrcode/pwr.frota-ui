import { getPessoaList } from "@/services/pessoa";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect";
import { useState } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
    size?: string
}

const SelectPessoa = (props: Props) => {
    const {
        name = "idPessoa",
        title = "Pessoa",
        control,
        size
    } = props;

    const { field: { value, onChange } } = useController({ control, name })
    const [opcoesPessoa, setOpcoesPessoa] = useState<Array<any>>([]);

    const getPessoas = async (pesquisa?: string) => {
        setOpcoesPessoa([]);

        const data = await getPessoaList(pesquisa, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        setOpcoesPessoa([...data]);
        return data;
    }
    
    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={opcoesPessoa}
            asyncFunction={getPessoas}
            value={value}
            setValue={onChange}
            isClearable
            filter
            size={size}
        />
    )
}

export default SelectPessoa