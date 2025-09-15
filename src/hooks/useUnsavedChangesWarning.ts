import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export const useUnsavedChangesWarning = (isDirty: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "Você tem alterações não salvas. Deseja realmente sair?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);


  useBlocker(({ currentLocation, nextLocation }) => {
    if (isDirty && currentLocation.pathname !== nextLocation.pathname) {
      return !window.confirm("Você tem alterações não salvas. Deseja realmente sair?");
    }
    return false;
  });
};