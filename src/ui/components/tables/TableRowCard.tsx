import { TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

type propsType = {
  children: React.ReactNode,
  id: string
}

export const TableRowCard = ({children, id}: propsType) => {

  const [mobile, setMobile] = useState<boolean>(window.innerWidth < 640 ? true : false);
  const classCell = `cell-${id}`;

  addEventListener("resize", function () {
    setMobile(window.innerWidth < 640 ? true : false);
  });

  useEffect(() => {
    changeCells();
  }, [mobile]);

  const changeCells = () => {
    const cells = document.getElementsByClassName(classCell);
    for(let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if(mobile) cell.setAttribute("style", "padding: 0px;");
    }
  }

  

  return (
    <TableRow key={id}
      className={mobile ? `
        flex flex-col gap-2 sm:hidden
        p-3 pl-5 pb-5
        border border-gray-200 sm:border-none
        shadow-md sm:shadow-none
        mt-1 mb-1
      ` : ""}
    >
      {children}
    </TableRow>
  )
}