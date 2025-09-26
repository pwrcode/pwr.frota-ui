import { getTipoMotorList } from "@/services/tipoMotor";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectTipoMotor = (props: Props) => {
    const {
        name = "idTipoMotor",
        title = "Tipo Motor",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getTiposMotor();
    }, []);

    const getTiposMotor = async (pesquisa?: string) => {
        const data = await getTipoMotorList(pesquisa);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getTiposMotor}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectTipoMotor