import AsyncSelect from "react-select/async";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { type listType } from "@/services/constants";
import { useRef } from "react";
import { useTheme } from "@/components/ui/theme-provider";

export const customSelectStyle = (isDarkMode: boolean, width: string) => ({
    control: (provided: any, state: any) => ({
        ...provided,
        width: width,
        minWidth: "100%",
        minHeight: "40px",
        borderRadius: "6px",
        outline: "none",
        boxShadow: "none",
        textAlign: "left",
        fontSize: '14px',
        background: isDarkMode ? "#1E293B" : "#FFFFFF",
        border: state.isFocused
            ? isDarkMode
                ? "2px solid white"
                : "2px solid rgba(59, 130, 246, 1)"
            : isDarkMode
                ? "2px solid #1E293B"
                : "1px solid rgba(229, 229, 229, 1)",
        color: isDarkMode ? "#D4D4D8" : "#000000",
        "&:hover": {
            border: state.isFocused
                ? isDarkMode
                    ? "2px solid white"
                    : "2px solid rgba(59, 130, 246, 1)"
                : isDarkMode
                    ? "2px solid rgba(161, 161, 170, 1)"
                    : "1px solid rgba(229, 229, 229, 1)",
            background: isDarkMode ? "#1E293B" : "#F5F5F5",
        },
    }),
    input: (provided: any) => ({
        ...provided,
        color: isDarkMode ? "white" : "black",
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        background: state.isSelected
            ? "rgba(96, 165, 250, 1)"
            : isDarkMode
                ? "#1E293B"
                : "#FFFFFF",
        color: state.isSelected ? "white" : isDarkMode ? "#D4D4D8" : "black",
        "&:hover": {
            background: state.isSelected
                ? isDarkMode
                    ? "rgba(96, 165, 250, 0.8)" : "rgba(96, 165, 250, 0.8)"
                : isDarkMode
                    ? "#374151" : "#E5E7EB",
        },
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: isDarkMode ? "#D4D4D8" : "black",
    }),
    multiValue: (provided: any) => ({
        ...provided,
        margin: "2px",
        maxWidth: "calc(100% - 8px)",
        background: isDarkMode ? "#1E293B" : "#FFFFFF",
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: isDarkMode ? "#D4D4D8" : "#000000",
        fontSize: "14px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "150px",
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: isDarkMode ? "#D4D4D8" : "#000000",
        "&:hover": {
            backgroundColor: isDarkMode ? "#374151" : "#E5E7EB",
            color: isDarkMode ? "white" : "black",
        },
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        flexWrap: "wrap",
        overflow: "hidden",
        maxHeight: "120px",
        overflowY: "auto",
    }),
    menu: (provided: any) => ({
        ...provided,
        background: isDarkMode ? "#1E293B" : "white",
    }),
});

const customNoOptionsMessage = () => "Nenhum item encontrado";

interface AsyncSelectProps {
    id?: string,
    name: string,
    title?: string,
    placeholder?: string,
    options?: listType,
    control?: any,
    value?: any,
    setValue?: React.Dispatch<React.SetStateAction<any>>,
    isDisabled?: boolean,
    size?: string,
    asyncFunction?: (inputValue: string) => Promise<any[]>,
    filter?: boolean,
    isMulti?: boolean,
    width?: string,
    isClearable?: boolean
}

export default function AsyncReactSelect({
    id,
    name,
    title,
    placeholder,
    options,
    control,
    value,
    setValue,
    isDisabled,
    size,
    asyncFunction,
    filter,
    isMulti,
    width,
    isClearable
}: AsyncSelectProps) {

    // @ts-ignore
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    const filterOptions = (inputValue: string) => {
        if (options) return [...options.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()) )];
        return [];
    };

    const loadOptions = (inputValue: string, callback: (options: any[]) => void) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(async () => {
            const result = asyncFunction ? await asyncFunction(inputValue) : filterOptions(inputValue);
            callback(result);
        }, 500);
    };

    const handleInputChange = (newValue: string, actionMeta: { action: string }) => {
        if (newValue === "" && actionMeta.action === "input-change") {
            loadOptions("", () => { });
        }
        return newValue;
    };

    return (
        <div className={`space-y-2 ${size || "w-full"}`}>
            {title && (
                <Label htmlFor={name}>{title}</Label>
            )}
            {control ? (
                <Controller
                    control={control}
                    name={name}
                    //rules={{ required: "Selecione uma opção" }}
                    render={({ field }) => {
                        //console.log(field.value);
                        return (
                            <AsyncSelect
                                {...field}
                                id={id}
                                name={name}
                                isDisabled={isDisabled}
                                defaultOptions={filter ? options : true}
                                cacheOptions
                                loadOptions={loadOptions}
                                onInputChange={handleInputChange}
                                placeholder={placeholder ?? "Selecione"}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => String(option.value)}
                                value={field && field.value !== undefined ? field.value : null} // MUITA ATENCAO
                                styles={customSelectStyle(isDarkMode, width ?? "")}
                                noOptionsMessage={customNoOptionsMessage}
                                isMulti={isMulti}
                                isClearable={isClearable}
                            />
                        )
                    }}
                />
            ) : (
                <AsyncSelect
                    id={id}
                    name={name}
                    isDisabled={isDisabled}
                    defaultOptions={filter ? options : true}
                    loadOptions={loadOptions}
                    onInputChange={handleInputChange}
                    placeholder={placeholder ?? "Selecione"}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => String(option.value)}
                    value={value}
                    onChange={setValue}
                    styles={customSelectStyle(isDarkMode, width ?? "")}
                    noOptionsMessage={customNoOptionsMessage}
                    isMulti={isMulti}
                    isClearable={isClearable}
                />
            )}
        </div>
    );
}