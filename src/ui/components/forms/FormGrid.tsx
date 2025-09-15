export enum FormGridVariant {
  sm4_md3_lg4_xl5 = "grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  sm6 = "grid grid-cols-1 sm:grid-cols-6",
  sm2 = "grid gris-cols-1 sm:grid-cols-2",
  md2 = "grid grid-cols-1 md:grid-cols-2"

}

type propsType = {
  children: React.ReactNode,
  grid?: FormGridVariant | string
}

export const FormGrid = ({children, grid}: propsType) => {
  return (
    <div
      className={`
        ${grid ?? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}
        gap-2 items-end
      `}
    >
      {children}
    </div>
  )
}

export const FormGridPair = ({children}: propsType) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {children}
    </div>
  )
}