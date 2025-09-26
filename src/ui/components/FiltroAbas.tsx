import { cn } from '@/lib/utils';
import { todosOption, type optionType } from '@/services/constants';
import { useController, type Control } from 'react-hook-form';

type Props = {
    options: Array<optionType>;
    control: Control<any>;
    name: string;
}

function FiltroAbas({ options, control, name }: Props) {
    const { field: { value, onChange } } = useController({ control, name })

    function getCor(index: number, selected: boolean) {
        const cores = [
            "bg-gray-500",
            "bg-yellow-500 text-yellow-500",
            "bg-green-500 text-green-500",
            "bg-orange-500 text-orange-500",
            "bg-blue-500 text-blue-500",
            "bg-red-500 text-red-500"
        ];

        return cn(cores[index % cores.length], selected ? "text-white" : "!bg-white");
    }

    return (
        <div className='flex gap-4 col-span-full mt-2'>
            {[todosOption].concat(options).map((x, index) => (
                <button
                    key={x.value + "_" + index}
                    className={cn(
                        'px-4 py-1 rounded-full bg-white drop-shadow-md font-semibold flex gap-2 items-center cursor-pointer',
                        getCor(index, x.value == value?.value)
                    )}
                    onClick={() => onChange(x)}
                >
                    {x.icone && <x.icone size={15} />} {x.label}
                </button>
            ))}
        </div>
    )
}

export default FiltroAbas