import { useState, useEffect } from "react";

export const useMobile = () => {

  const [width, setWidth] = useState<number>(0);

  const sm = 640;
  const md = 768;
  const lg = 1024;
  const xl = 1280;
  const xxl = 1536;

  const checkMobile = (dimension: number) => {
    return dimension < 640;
  }
  const checkSmall = (dimension: number) => {
    return dimension >= 640 && dimension < 768;
  }
  const checkMedium = (dimension: number) => {
    return dimension >= 768 && dimension < 1024;
  }
  const checkLarge = (dimension: number) => {
    return dimension >= 1024 && dimension < 1280;
  }
  const checkExtraLarge = (dimension: number) => {
    return dimension >= 1280 && dimension < 1536;
  }
  const checkDoubleExtraLarge = (dimension: number) => {
    return dimension >= 1536;
  }

  const [isMobile, setIsMobile] = useState<boolean>(checkMobile(window.innerWidth));
  const [isSmall, setIsSmall] = useState<boolean>(checkSmall(window.innerWidth));
  const [isMedium, setIsMedium] = useState<boolean>(checkMedium(window.innerWidth));
  const [isLarge, setIsLarge] = useState<boolean>(checkLarge(window.innerWidth));
  const [isExtraLarge, setIsExtraLarge] = useState<boolean>(checkExtraLarge(window.innerWidth));
  const [isDoubleExtraLarge, setIsDoubleExtraLarge] = useState<boolean>(checkDoubleExtraLarge(window.innerWidth));

  addEventListener("resize", function () {
    setWidth(window.innerWidth);
    setIsMobile(checkMobile(window.innerWidth));
    setIsSmall(checkSmall(window.innerWidth));
    setIsMedium(checkMedium(window.innerWidth));
    setIsLarge(checkLarge(window.innerWidth));
    setIsExtraLarge(checkLarge(window.innerWidth));
    setIsDoubleExtraLarge(checkLarge(window.innerWidth));
  });

  // Card
  const [rowStyle, setRowStyle] = useState<string>("");
  const [cellStyle, setCellStyle] = useState<string>("");
  const [hiddenMobile, setHiddenMobile] = useState<string>("");

  const cardStyle = (`
    flex flex-col gap-2 sm:hidden
    p-3 pl-5 pb-5
    border border-gray-200 sm:border-none
    shadow-md sm:shadow-none
    mt-1 mb-1
  `);

  useEffect(() => {
    if(isMobile) {
      setRowStyle(` 
        flex flex-col gap-2 sm:hidden
        p-3 pl-5 pb-5
        border border-gray-200 sm:border-none
        shadow-md sm:shadow-none
        mt-1 mb-1 
      `);
      setCellStyle(" p-0 text-left ");
      setHiddenMobile(" hidden ");
    }
    else {
      setRowStyle(" ");
      setCellStyle(" ");
      setHiddenMobile(" ");
    }
  }, [isMobile]);
  //

  return {
    width, sm, md, lg, xl, xxl,
    checkMobile, checkSmall, checkMedium, checkLarge,
    isMobile, isSmall, isMedium, isLarge, isExtraLarge, isDoubleExtraLarge,
    cardStyle, rowStyle, cellStyle, hiddenMobile
  }
}