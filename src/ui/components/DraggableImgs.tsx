'use client';

// @ts-ignore
const apiImg = import.meta.env.VITE_API_IMG_URL + "/api/arquivo/download-direto-new/";

export type ImgType = {
  id: number,
  arquivoImagemId: number,
  imagemUrl: string,
  ordem: number
};

import React, { useEffect, useState } from 'react';
import { Download, TrashIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { ImageSrc } from '@/ui/components/ImageSrc';

interface Props {
  imagensIds: number[],
  changeIdsImagens?: (codigos: number[]) => void,
  removerImg: (i: number) => void,
  alt?: string
}

// ReactPills
const DraggableImgs = ({ imagensIds, changeIdsImagens, removerImg, alt }: Props) => {

  const [items, setItems] = useState<number[]>(imagensIds);

  useEffect(() => {
    setItems(imagensIds);
  }, [imagensIds]);

  useEffect(() => {
    if (changeIdsImagens) changeIdsImagens(items);
  }, [items]);

  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<number | null>(null);

  // @ts-ignore
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: number) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, item: number) => {
    e.preventDefault();
    setDraggedOverItem(item);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!draggedItem || !draggedOverItem || draggedItem === draggedOverItem) {
      return;
    }

    const newItems = [...items];
    const draggedIndex = items.findIndex(item => item === draggedItem);
    const dropIndex = items.findIndex(item => item === draggedOverItem);

    // Remove the dragged item and insert it at the new position
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, removed);

    setItems(newItems);
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const removerImagem = (idRemover: number) => {
    removerImg(idRemover);
  }

  const downloadImagem = (idDownload: number) => {
    const url = apiImg + idDownload;
    fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image.jpg'; // Use provided filename or default
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      toast.error("Erro ao baixar imagem", {autoClose: 2000});
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {items.map(item => (
        <div
          className={`
            relative aspect-square border flex items-center justify-center border-dashed border-[2px] border-slate-200 rounded-md p-1
            ${draggedOverItem === item ? 'border border-slate-400' : 'border-dashed'}
            ${draggedItem === item ? 'opacity-80' : ''}
          `}
          key={item}
        >
          <div className="absolute text-white top-2 right-2 flex flex-col gap-2">
            <div className="bg-green-600 hover:bg-green-500 rounded cursor-pointer p-1">
              <Download className="size-5" onClick={() => downloadImagem(item)} />
            </div>
            <div className="bg-red-600 hover:bg-red-500 rounded cursor-pointer p-1">
              <TrashIcon className="size-5" onClick={() => removerImagem(item)} />
            </div>
          </div>
          <div
            draggable
            onDragStart={e => handleDragStart(e, item)}
            onDragOver={e => handleDragOver(e, item)}
            onDrop={handleDrop}
          >
            <ImageSrc
              idArquivo={item}
              alt={alt ?? "Produto"}
              typeImg={1}
              style={`
                w-full aspect-square
                object-contain
                text-white
                cursor-grab
                transition-colors
              `}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DraggableImgs;
