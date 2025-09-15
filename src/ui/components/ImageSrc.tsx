import { ImgOff } from "@/assets/ImgOff";
import { UserImgOff } from "@/assets/UserImgOff";
import getAxios from "@/axios/configAxios";
import { useEffect, useState } from "react";

const api = import.meta.env.VITE_API_URL + "/arquivo";

export enum TypesImg {
  user, any
}

type imgProps = {
  idArquivo?: number | null,
  alt: string,
  style?: string,
  typeImg: TypesImg
}

export const ImageSrc = ({idArquivo, alt, style, typeImg}: imgProps) => {

  useEffect(() => {
    return () => {
      if (src) {
        URL.revokeObjectURL(src);
      }
    };
  }, []);

  const [src, setSrc] = useState<string | null>(null);
  
  useEffect(() => {
    getFoto();
  }, [idArquivo]);

  const getFoto = async () => {
    if (idArquivo == null) {
      setSrc(null);
      return
    }
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(api + `/${idArquivo}`, {
      responseType: 'blob'
    });
    const url = URL.createObjectURL(response.data);
    setSrc(url);
  }

  const handleError = () => {
    setSrc(null);
  };

  return (
    <>
      {src ? (
        <img
          src={src}
          alt={alt}
          onError={handleError}
          className={style}
        />
      ) : (
        <>
          {typeImg === 0 && <UserImgOff />}
          {typeImg === 1 && <ImgOff />}
        </>
      )}
    </>
  );
}