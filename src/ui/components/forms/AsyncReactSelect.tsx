import AsyncSelect from "react-select/async";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { type listType } from "@/services/constants";
import { useRef } from "react";
import { useTheme } from "@/components/ui/theme-provider";

// Configuração centralizada das cores do select
const selectColors = {
  light: {
    background: "#FFFFFF",
    backgroundHover: "#F5F5F5",
    text: "#000000",
    border: "rgba(229, 229, 229, 1)",
    borderHover: "rgba(229, 229, 229, 1)",
    borderFocus: "#3b82f6",
    optionBackground: "#FFFFFF",
    optionBackgroundHover: "#f1f5f9",
    optionBackgroundSelected: "#3b82f6",
    optionText: "black",
    optionTextSelected: "white",
    multiValueBackground: "#f1f5f9",
    multiValueRemoveHover: "#e2e8f0",
    menuBorder: "#E5E7EB",
    menuShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
  },
  dark: {
    background: "#0c0c0d",
    backgroundHover: "#0c0c0d",
    text: "#fafafa",
    border: "#27272a",
    borderHover: "#71717a",
    borderFocus: "#71717a",
    optionBackground: "#0c0c0d",
    optionBackgroundHover: "#18181b",
    optionBackgroundSelected: "#27272a",
    optionText: "#fafafa",
    optionTextSelected: "#fafafa",
    multiValueBackground: "#18181b",
    multiValueText: "#fafafa",
    multiValueRemove: "#a1a1aa",
    multiValueRemoveHover: "#27272a",
    menuBorder: "#27272a",
    menuShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
  }
};

export const customSelectStyle = (isDarkMode: boolean, width: string) => {
    const colors = isDarkMode ? selectColors.dark : selectColors.light;

    return {
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
            background: colors.background,
            border: state.isFocused
                ? `2px solid ${colors.borderFocus}`
                : `1px solid ${colors.border}`,
            color: colors.text,
            "&:hover": {
                border: state.isFocused
                    ? `2px solid ${colors.borderFocus}`
                    : `1px solid ${colors.borderHover}`,
                background: colors.backgroundHover,
            },
        }),
        input: (provided: any) => ({
            ...provided,
            color: colors.text,
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            background: state.isSelected
                ? colors.optionBackgroundSelected
                : state.isFocused
                    ? colors.optionBackgroundHover
                    : colors.optionBackground,
            color: state.isSelected
                ? colors.optionTextSelected
                : colors.optionText,
            "&:hover": {
                background: state.isSelected
                    ? colors.optionBackgroundSelected
                    : colors.optionBackgroundHover,
            },
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: colors.text,
        }),
        multiValue: (provided: any) => ({
            ...provided,
            margin: "2px",
            maxWidth: "calc(100% - 8px)",
            background: colors.multiValueBackground,
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: colors.multiValueText || colors.text,
            fontSize: "14px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: colors.multiValueRemove || colors.text,
            "&:hover": {
                backgroundColor: colors.multiValueRemoveHover,
                color: colors.text,
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
            background: colors.background,
            border: `1px solid ${colors.menuBorder}`,
            borderRadius: "8px",
            boxShadow: colors.menuShadow,
            zIndex: 9999,
            overflow: "hidden",
        }),
        menuList: (provided: any) => ({
            ...provided,
            background: colors.background,
            maxHeight: "200px",
            borderRadius: "8px",
        }),
    };
};

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