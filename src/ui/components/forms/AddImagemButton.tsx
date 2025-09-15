import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { postArquivo } from '@/services/arquivo';
import { toast } from 'react-toastify';
import { errorMsg } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type propsType = {
  referenciaTipo: string,
  addIdImagem: (codigo: number) => void,
  children?: React.ReactNode,
  isDisabled?: boolean
}

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/arquivo";

export const AddImgButton = ({referenciaTipo, addIdImagem, children}: propsType) => {

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
      addIdImagem(response.id);
      toast.dismiss(process);
    }
    catch(error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 5000 });
    }
  }

  return (
    <div {...getRootProps()} className="size-full">
      <input {...getInputProps()} />
      {children ?? (
        <Button variant="blue" type="button" className="size-[40px]">
          <Plus />
        </Button>
      )}
    </div>
  )
}