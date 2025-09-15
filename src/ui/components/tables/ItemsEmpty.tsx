import { renderIcon } from "../RenderIcon"

type props = {
  icon?: string,
  iconSize?: string,
  title?: string,
  titleSize?: string,
  py?: string,
  children?: React.ReactNode
}

export const ItemsEmpty = ({icon, iconSize, title, titleSize, py, children}: props) => {

  const iconStyle = `text-gray-600 dark:text-gray-300 ${iconSize ?? "size-6"}`;
  const titleStyle = `text-gray-600 dark:text-gray-300 text-center font-normal ${titleSize ?? "text-md"}`;

  return (
    <div className={`
      flex flex-col gap-1 justify-center items-center
      ${py ?? "py-10"} px-4
    `}>
      {children ?? (
        <>
          {icon && renderIcon(icon, iconStyle)}
          <span className={titleStyle}>{title ?? "Nenhum item cadastrado"}</span>
        </>
      )}
    </div>
  )
}