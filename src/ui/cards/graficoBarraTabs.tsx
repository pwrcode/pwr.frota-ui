import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

type Tab = {
    tabKey: string,
    descricao: string,
    icon: LucideIcon
}

type Props = {
    titulo: string,
    subtitulo: string,
    tabs: Array<Tab>,
    children: ReactNode
}

const GraficoBarraTabs = ({ titulo, subtitulo, tabs, children }: Props) => {
    const [tabNameMobile, setTabNameMobile] = useState(tabs[0].descricao);
    const [isDropDownTabsOpen, setIsDropDownTabsOpen] = useState(false);

    return (
        <Card>
            <Tabs defaultValue={tabs[0].tabKey} className='w-full flex flex-col gap-2'>
                <CardHeader>
                    <div className="flex justify-between">
                        <div>
                            <CardTitle>{titulo}</CardTitle>
                            <CardDescription>{subtitulo}</CardDescription>
                        </div>

                        <TabsList className='w-fit h-min hidden md:flex justify-start gap-1 p-1 bg-muted rounded-lg dark:!bg-gray-800'>
                            {tabs.map(tab => (
                                <TabsTrigger
                                    key={tab.tabKey}
                                    value={tab.tabKey}
                                    onClick={() => setTabNameMobile(tab.descricao)}
                                    className='cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-50 hover:text-orange-600'
                                >
                                    <tab.icon size={16} />
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <DropdownMenu onOpenChange={(open) => setIsDropDownTabsOpen(open)} open={isDropDownTabsOpen}>
                        <TabsList className='flex w-full px-1 py-1 md:hidden bg-muted rounded-lg'>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"ghost"} className='w-full text-foreground flex justify-between items-center gap-2 py-3 px-4 hover:bg-orange-50 hover:text-orange-600'>
                                    <div className='flex items-center gap-2'>
                                        {tabs.map(tab => (tabNameMobile === tab.descricao && <tab.icon size={16} />))}
                                        {tabNameMobile}
                                    </div>
                                    {<div className='ml-4'>{isDropDownTabsOpen ? <ChevronUp /> : <ChevronDown />}</div>}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='md:hidden w-64 p-1'>
                                {tabs.map(tab => (
                                    <DropdownMenuItem
                                        className='p-0'
                                        key={tab.tabKey}
                                    >
                                        <TabsTrigger
                                            value={tab.tabKey}
                                            onClick={() => setTabNameMobile(tab.descricao)}
                                            className='w-full justify-start flex items-center gap-2 py-3 px-3 rounded-md transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-50 hover:text-orange-600'
                                        >
                                            <tab.icon size={16} />
                                            {tab.descricao}
                                        </TabsTrigger>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </TabsList>
                    </DropdownMenu>

                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Tabs>
        </Card>
    )
}

GraficoBarraTabs.TabContent = ({ tabKey, children }: { tabKey: string, children: ReactNode }) => (
    <TabsContent value={tabKey}>
        {children}
    </TabsContent>
)

export default GraficoBarraTabs