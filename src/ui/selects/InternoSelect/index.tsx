import { SimNaoOptions } from "@/services/constants";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectIsInterno = (props: Props) => {
    const {
        name = "isInterno",
        title = "Interno",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={SimNaoOptions}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectIsInterno