import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { errorMsg } from "@/services/api";
import { addBairro, type dadosAddEdicaoBairroType, getBairroPorId } from "@/services/bairro";
import { type listType } from "@/services/constants";
import { X } from "lucide-react";
import { useState } from "react";
import { type FieldValues, type UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import { PlusButton } from "../buttons/PlusButton";
import AsyncReactSelect from "../forms/AsyncReactSelect";
import InputLabelValue from "../forms/InputLabelValue";

type paramsType = {
  municipios: listType,
  municipio: any,
  fieldName: string,
  setValue: UseFormSetValue<FieldValues>,
  update: () => Promise<any>
}

export const AddBairro = ({municipios, municipio, fieldName, setValue, update}: paramsType) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [descricao, setDescricao] = useState<string>("");

  const handleClickAdd = () => {
    setOpen(true);
  }

  const submit = async () => {
    if (!municipio) return
    if (loading) return
    setLoading(true);
    const process = toast.loading("Salvando bairro");
    try {
      if (!descricao || descricao.length === 0) throw new Error("Informe o bairro");
      const data: dadosAddEdicaoBairroType = {
        idMunicipio: municipio.value,
        descricao: descricao
      }
      const response = await addBairro(data);
      setFieldValue(response.id);
      await update();
      toast.update(process, { render: response.mensagem, type: "success", isLoading: false, autoClose: 2000 });
      setOpen(false);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 4000 });
    }
    finally {
      setLoading(false);
      setTimeout(() => toast.dismiss(process), 4000);
    }
  }

  const setFieldValue = async (id: any) => {
    if (!(id && Number(id))) {
      return toast.error("Erro ao inserir o bairro");
    }
    try {
      const data = await getBairroPorId(Number(id));
      setValue(fieldName, {value: data.id, label: data.descricao});
    }
    catch (error: Error | any) {
      toast.error("Erro ao inserir o bairro");
    }
  }

  return (
    <>
      <PlusButton func={handleClickAdd} />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent aria-describedby={undefined}>
            <AlertDialogHeader className="flex flex-row justify-between items-center text-[17px] font-medium">
              <AlertDialogTitle>Novo bairro</AlertDialogTitle>
              <AlertDialogCancel className="border-none">
                <X className="h-[40px] w-[40px]" />
              </AlertDialogCancel>
            </AlertDialogHeader>

            <AsyncReactSelect
              name="municipio"
              title="Município"
              options={municipios ?? []}
              value={municipio}
              isDisabled={true}
            />
            <InputLabelValue
              name="descricao"
              title="Bairro"
              value={descricao}
              setValue={setDescricao}
            />

            <AlertDialogFooter>
              <Button onClick={submit} className="size-[40px]" variant="success" disabled={loading}>Salvar</Button>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}