import { defineConfig  } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

const injectBuildTimestamp = () => {
  return {
    name: 'inject-build-timestamp',
    transformIndexHtml(html: any) {
      const timestamp = new Date().toISOString();
      return html.replace('%BUILD_TIMESTAMP%', timestamp);
    },
  };
};


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectBuildTimestamp()],
  server: {
    port: 5097, // Define a porta aqui
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

