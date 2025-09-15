export enum FiltersGrid {
  mb2_md3_lg4 = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  mb2_md3_lg4_xl5 = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  sm2_md3_lg4 = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  sm2_md3_lg4_xl5 = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  sm2_md3_lg12_xl10 = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 xl:grid-cols-10",
  sm2_md12_lg12_xl10 = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-10",
  sm2_lg4 = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  sm2_lg3_xl4 = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  mb2_sm4_md8_lg6 = "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-6",
}

export const Filters = ({children, size, grid}: {children: React.ReactNode, size?: string, grid?: FiltersGrid}) => {
  return (
    <div className={`
      ${size ?? "w-full"}
      ${grid ?? "flex flex-col sm:flex sm:flex-row"}
      gap-2
    `}>
      {children}
    </div>
  )
}