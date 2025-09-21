import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { postArquivo } from '@/services/arquivo';
import { toast } from 'react-toastify';
import { Image } from 'lucide-react';
import { errorMsg } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ImageSrc } from '../ImageSrc';

type propsType = {
  descricao: string,
  codigos: number[],
  changeCodigos: (codigos: number[]) => void,
  addCodigo: (codigo: number) => void,
  alt: string,
  isDisabled?: boolean
}

export const UploadFotoMultiple = ({descricao, codigos, changeCodigos, addCodigo, alt}: propsType) => {

  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    setIds(codigos || []);
  }, [codigos]);

  // @ts-ignore
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onabort = () => alert('file reading was aborted');
      reader.onerror = () => alert('file reading has failed');
      reader.onload = () => {
        const formData = new FormData();
        // @ts-ignore
        formData.append("id", 0);
        formData.append("descricao", descricao);
        formData.append("extensao", "img");
        formData.append("type", file.type);
        formData.append("file", file);
        submit(formData);
      }
      reader.readAsArrayBuffer(file);
    })
  }, []);

  const {getRootProps, getInputProps} = useDropzone({onDrop});

  const submit = async (data: any) => {
    const process = toast.loading("Salvando foto...");
    try {
      const response = await postArquivo(data);
      addCodigo(response.id);
      toast.dismiss(process);
    }
    catch(error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 5000 });
    }
  }

  const removerFotos = () => {
    changeCodigos([]);
  }

  return (
    <div className="flex flex-col items-center relative -z-1">

      <div {...getRootProps()}
        className={`
          w-full p-4 py-6
          flex flex-col gap-3 justify-center items-center
          bg-gray-100 dark:bg-muted border-dashed border-[3px] border-gray-300 rounded-md shadow-md
          cursor-pointer
        `}
      >
        <input {...getInputProps()} />

        <div className="grid grid-cols-3">
          {ids ? (
            ids.map((id) => (
              <div className="size-14 flex justify-center items-center overflow-hidden inset-0 shadow-inner rounded-full" key={id}>
                <ImageSrc idArquivo={id} style="w-full object-contain" alt={alt} typeImg={1} />
              </div>
            ))
          ) : (
            <Image className="size-[70%] text-gray-400" />
          )}
        </div>

        <div className="h-12 flex items-center">
          {ids.length == 0 && (
            <p className="text-center text-sm font-medium text-gray-500 px-3">
              Clique ou arraste as imagens desejadas até aqui
            </p>
          )}
        </div>
      </div>

      {ids.length > 0 && (
        <Button onClick={() => removerFotos()} type="button" variant="destructive" className="absolute bottom-6">
          Remover fotos
        </Button>
      )}

    </div>
  )
}