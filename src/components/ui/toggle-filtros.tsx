import type { LucideIcon } from "lucide-react";
import { useController, type Control } from "react-hook-form";


type Props = {
    options: Array<{
        color: string,
        value: any,
        label: string,
        icon: LucideIcon,
        quantidade: number
    }>,
    control: Control<any>,
    name: string,
    isDisabled?: boolean
}

export const coresToggleFiltros = [
    "gray",
    "blue",
    "orange",
    "green",
    "red",
    "default"
]

export default function ToggleFiltros({ options, control, name, isDisabled }: Props) {
    const { field: { value, onChange } } = useController({ control, name })

    const getColorClasses = (color: string) => {
        switch (color) {
            case "gray":
                return {
                    bg: "bg-gray-600",
                    text: "text-gray-600",
                    selectedBg: "bg-gray-600",
                    selectedText: "text-white"
                };
            case "blue":
                return {
                    bg: "bg-blue-600",
                    text: "text-blue-600",
                    selectedBg: "bg-blue-600",
                    selectedText: "text-white"
                };
            case "orange":
                return {
                    bg: "bg-orange-600",
                    text: "text-orange-600",
                    selectedBg: "bg-orange-600",
                    selectedText: "text-white"
                };
            case "green":
                return {
                    bg: "bg-green-600",
                    text: "text-green-600",
                    selectedBg: "bg-green-600",
                    selectedText: "text-white"
                };
            case "red":
                return {
                    bg: "bg-red-600",
                    text: "text-red-600",
                    selectedBg: "bg-red-600",
                    selectedText: "text-white"
                };
            default:
                return {
                    bg: "bg-gray-600",
                    text: "text-gray-600",
                    selectedBg: "bg-gray-600",
                    selectedText: "text-white"
                };
        }
    };

    return (
        <div className="w-full mb-3">
            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const colors = getColorClasses(option.color);
                    const isSelected = value?.value === option.value;
                    const Icon = option.icon;

                    return (
                        <button
                            key={option.value}
                            disabled={isDisabled}
                            onClick={() => onChange(option)}
                            className={`
                                inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium
                                transition-all duration-200 hover:shadow-sm
                                ${isSelected
                                    ? `${colors.selectedBg} ${colors.selectedText} border-transparent shadow-sm`
                                    : `bg-card dark:bg-card ${colors.text} border-gray-300 dark:border-black-600 hover:border-gray-400`
                                }
                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                            <span className={`
                                px-2 py-0.5 rounded-full text-xs font-semibold
                                ${isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }
                            `}>
                                {option.quantidade}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}