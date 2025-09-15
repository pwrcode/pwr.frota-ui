import { ImageSrc, TypesImg } from "../ImageSrc";

type propsType = {
  id: string | number | null,
  alt: string,
  rounded?: string,
  size?: string
}

export const ImgCell = ({id, alt, rounded, size}: propsType) => {

  const styleRounded = rounded ? `rounded-${rounded}` : "";

  return (
    <div
      className={`${size ?? "size-[50px]"} flex justify-center items-center overflow-hidden`}
    >
      <ImageSrc idArquivo={Number(id)} alt={alt} style={`w-full ${styleRounded}`} typeImg={TypesImg.any} />
    </div>
  )
}

export const DescCell = ({id, descricao, subdescricao}: {id: number, descricao: string, subdescricao?: string}) => {
  return (
    <div>
      <div className="text-gray-800 dark:text-gray-200 font-bold">{id} - {descricao}</div>
      {(subdescricao && subdescricao.length > 0) && <div className="text-gray-500">{subdescricao}</div>}
    </div>
  )
}

type imgDescCellType = {
  idImg: string | number | null,
  alt: string,
  rounded: string,
  idItem: number,
  desc: string
  subdescricao?: string
};

export const ImgDescCell = ({idImg, alt, rounded, idItem, desc, subdescricao}: imgDescCellType) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <ImgCell id={idImg} alt={alt} rounded={rounded} />
      <DescCell id={idItem} descricao={desc} subdescricao={subdescricao}/>
    </div>
  )
}