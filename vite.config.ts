import { defineConfig  } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from '@tailwindcss/vite'

const injectBuildTimestamp = () => {
  return {
    name: 'inject-build-timestamp',
    transformIndexHtml(html: any) {
      const timestamp = new Date().toISOString();
      return html.replace('%BUILD_TIMESTAMP%', timestamp);
    },
  };
};


export default defineConfig({
  plugins: [react(), injectBuildTimestamp(), tailwindcss()],
  server: {
    port: 5097,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

