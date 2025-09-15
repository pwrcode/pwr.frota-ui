import { useState } from "react";

export const useResponsive = (id?: string) => {

  const component = id ? document.getElementById(id) : undefined;

  const getIdComponentWitdh = () => {
    try {
      const initialWidth = component ? component.clientWidth : window.innerWidth;
      if (typeof(initialWidth) === "number") return initialWidth
      return window.innerWidth
    }
    catch {
      return window.innerWidth
    }
  }

  const initialWidth = getIdComponentWitdh();
  const [width, setWidth] = useState<number>(initialWidth);

  const sm = 640;
  const md = 768;
  const lg = 1024;
  const xl = 1280;
  const xxl = 1536;

  const checkMobile = (dimension: number) => {
    return dimension < sm;
  }
  const checkSmall = (dimension: number) => {
    return dimension >= sm && dimension < md;
  }
  const checkMedium = (dimension: number) => {
    return dimension >= md && dimension < lg;
  }
  const checkLarge = (dimension: number) => {
    return dimension >= lg && dimension < xl;
  }
  const checkExtraLarge = (dimension: number) => {
    return dimension >= xl && dimension < xxl;
  }
  const checkDoubleExtraLarge = (dimension: number) => {
    return dimension >= xxl;
  }

  const [isMb, setIsMb] = useState<boolean>(checkMobile(initialWidth));
  const [isSm, setIsSm] = useState<boolean>(checkSmall(initialWidth));
  const [isMd, setIsMd] = useState<boolean>(checkMedium(initialWidth));
  const [isLg, setIsLg] = useState<boolean>(checkLarge(initialWidth));
  const [isXl, setIsXl] = useState<boolean>(checkExtraLarge(initialWidth));
  const [isXxl, setIsXxl] = useState<boolean>(checkDoubleExtraLarge(initialWidth));

  addEventListener("resize", function () {
    const w = getIdComponentWitdh();
    setWidth(w);
    setIsMb(checkMobile(w));
    setIsSm(checkSmall(w));
    setIsMd(checkMedium(w));
    setIsLg(checkLarge(w));
    setIsXl(checkExtraLarge(w));
    setIsXxl(checkDoubleExtraLarge(w));
  });

  return {
    width,
    sm, md, lg, xl, xxl,
    isMb, isSm, isMd, isLg, isXl, isXxl,
    checkMobile, checkSmall, checkMedium, checkLarge
  }
}

/*
const Filters = ({children}: {children: React.ReactNode}) => {
  const { isMb, isSm, isMd, isLg } = useResponsive();
  return (
    <div className={`w-full grid ${isMb && "grid-cols-1"} ${isSm && "grid-cols-2"} ${isMd && "grid-cols-12"} ${isLg && "grid-cols-10"} gap-2`}>
      {children}
    </div>
  )
}
*/