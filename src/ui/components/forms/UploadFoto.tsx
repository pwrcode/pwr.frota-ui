import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { postArquivo } from '@/services/arquivo';
import { toast } from 'react-toastify';
import { Image } from 'lucide-react';
import { errorMsg } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ImageSrc } from '../ImageSrc';

type propsType = {
  referenciaTipo: string,
  idArquivo: number,
  changeIdArquivo: (codigo: number) => void,
  alt: string,
  isDisabled?: boolean
}

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/arquivo";

export const UploadFoto = ({referenciaTipo, idArquivo, changeIdArquivo, alt}: propsType) => {

  // @ts-ignore
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onabort = () => alert('file reading was aborted');
      reader.onerror = () => alert('file reading has failed');
      reader.onload = () => {

        const formData = new FormData();
        // @ts-ignore
        formData.append("ReferenciaTipo", referenciaTipo);
        formData.append("File", file);
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
      changeIdArquivo(response.id);
      toast.dismiss(process);
    }
    catch(error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 5000 });
    }
  }

  const removerFoto = () => {
    changeIdArquivo(0);
  }

  return (
    <div className="flex flex-col items-center relative">

      <div {...getRootProps()}
        className={`
          w-full p-4 py-6
          flex flex-col gap-3 justify-center items-center
          bg-gray-100 dark:bg-slate-300 border-dashed border-[3px] border-gray-300 rounded-md shadow-md
          cursor-pointer
        `}
      >
        <input {...getInputProps()} />

        <div className="size-14 flex justify-center items-center overflow-hidden inset-0 shadow-inner rounded-full">
          {idArquivo ? (
            <ImageSrc idArquivo={idArquivo} style="w-full object-contain" alt={alt} typeImg={1} />
          ) : (
            <Image className="size-[70%] text-gray-400" />
          )}
        </div>

        <div className="h-12 flex items-center">
          {!idArquivo && (
            <p className="text-center text-sm font-medium text-gray-500 px-3">
              Clique ou arraste a imagem desejada até aqui
            </p>
          )}
        </div>
      </div>

      {idArquivo ? (
        <Button onClick={() => removerFoto()} type="button" variant="destructive" className="absolute bottom-6">
          Remover foto
        </Button>
      ) : <></>}

    </div>
  )
}