import { cn } from "@/lib/utils"
import { renderIcon } from "@/ui/components/RenderIcon";

export type statusType = "success" | "error" | "warning" | "default";

type Props = {
    descricao: string,
    valor: number,
    status?: statusType
    loading?: boolean,
    icone?: string
}

function Totalizador({ descricao, valor, status, loading, icone }: Props) {
    function getBorderColor() {
        if (status == "success") return "border-green-200";
        if (status == "error") return "border-red-200";
        if (status == "warning") return "border-yellow-200";
        if (status == "default") return "border-indigo-200";

        return "";
    }

    function getIconeColor() {
        if (status == "success") return "bg-green-400";
        if (status == "error") return "bg-red-400";
        if (status == "warning") return "bg-yellow-400";
        if (status == "default") return "bg-indigo-400";

        return "";
    }

    return (
        <>
            {loading ? (
                <div
                    className={cn(
                        "p-4 border-l-8 bg-white rounded-lg drop-shadow-lg space-y-2",
                        "border-gray-300 animate-pulse dark:bg-card"
                    )}
                >
                    <div className={cn("w-10 bg-gray-300 rounded-lg aspect-square mr-2 flex items-center justify-center flex-shrink-0")} />
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                    <div className="border-b border-gray-300 opacity-50" />
                    <div className="h-6 bg-gray-300 rounded w-8" />
                </div>
            ) : (
                <div className={cn("p-4 border bg-white rounded-lg drop-shadow-lg space-y-2 dark:bg-card dark:!border-gray-700", getBorderColor())}>
                    {icone && (
                        <div className={cn("w-10 rounded-lg aspect-square mr-2 flex items-center justify-center flex-shrink-0", getIconeColor())}>
                            {renderIcon(icone, "size-5")}
                        </div>
                    )}
                    <p className="text-sm text-gray-600 dark:text-white">{descricao}</p>
                    <div className="border-b border-gray-500 opacity-15" />
                    <p className="font-semibold">{valor.toLocaleString()}</p>
                </div >
            )}
        </>
    )
}

export default Totalizador