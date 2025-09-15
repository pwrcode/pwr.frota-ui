import { useEffect } from 'react';

export function useCheckNewVersion(intervalMs = 60000) {
  useEffect(() => {
    // @ts-ignore
    if (import.meta.env.DEV) {
      console.log('🛑 Modo desenvolvimento: verificação de versão desabilitada');
      return;
    }
    
    const currentBuildTime = document
      .querySelector('meta[name="build-time"]')
      ?.getAttribute('content');

    const checkForUpdate = async () => {
      try {
        const response = await fetch('/index.html', {
          cache: 'no-cache',
        });
        const text = await response.text();

        // Pega o novo valor do build-time do HTML baixado
        const match = text.match(/<meta name="build-time" content="(.*?)"/);
        const newBuildTime = match?.[1];

        if (newBuildTime && newBuildTime !== currentBuildTime) {
          console.log('🚨 Nova versão detectada:', newBuildTime);
          window.location.reload(); // força recarregar
        } else {
            console.log('Sem atualização - Ultima versão:', newBuildTime);
        }
      } catch (err) {
        console.error('Erro ao verificar nova versão:', err);
      }
    };

    const interval = setInterval(checkForUpdate, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);
}
