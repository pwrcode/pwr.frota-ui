type paramsType = {
  children: React.ReactNode,
  style?: string,
  size?: string,
  custom?: string
};

export const DivCheckBox = ({children, style, size, custom}: paramsType) => {
  return (
    <div className={
      custom ? custom : (
        style === "micro" && 'h-min' ||
        style === "small" && 'h-min py-2' ||
        style === "medium" && 'h-min py-2 sm:h-[72px] sm:pt-[42px]' ||
        style === "medium-full" && 'h-min w-full py-2 sm:h-[72px] sm:pt-[42px]' ||
        style === "line" && 'flex w-full gap-4 justify-start col-span-full py-2' || "" +
        " " + size
      )
    }>
      {children}
    </div>
  )
}

// columns = micro : caixa única micro, tamanho checkbox + padding pequeno
// columns = small : caixa única menor, proporção Input
// columns = medium : caixa única maior, proporção InputLabel
// columns = line : linha inteira