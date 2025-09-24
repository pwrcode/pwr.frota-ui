import { getVeiculoTanqueList } from "@/services/veiculoTanque";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect, useState } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
    idVeiculo?: number;
}

const SelectVeiculoTanque = (props: Props) => {
    const {
        name = "veiculoTanque",
        title = "Veículo Tanque",
        control,
        idVeiculo
    } = props;

    const { field: { value, onChange } } = useController({ control, name })
    const [opcoesVeiculoTanque, setOpcoesVeiculoTanque] = useState<Array<any>>([]);

    useEffect(() => {
        getVeiculoTanques();
    }, [idVeiculo]);

    const getVeiculoTanques = async (pesquisa?: string) => {
        setOpcoesVeiculoTanque([]);
        
        if (!idVeiculo)
            return [];

        const data = await getVeiculoTanqueList(pesquisa, idVeiculo, undefined);
        setOpcoesVeiculoTanque([...data]);
        return data;
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={opcoesVeiculoTanque}
            asyncFunction={getVeiculoTanques}
            value={value}
            setValue={onChange}
            isClearable
            filter
        />
    )
}

export default SelectVeiculoTanque