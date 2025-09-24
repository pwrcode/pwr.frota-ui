import { getPessoaList } from "@/services/pessoa";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectMotorista = (props: Props) => {
    const {
        name = "motorista",
        title = "Motorista",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getMotoristas();
    }, []);

    const getMotoristas = async (pesquisa?: string) => {
        const data = await getPessoaList(pesquisa, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined, undefined);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getMotoristas}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectMotorista