import{defineConfig}from"vite";
import react from"@vitejs/plugin-react";
import tailwindcss from"@tailwindcss/vite";

export default defineConfig({
  plugins:[react(),tailwindcss()],
  build:{
    rollupOptions:{
      output:{
        manualChunks:{
          "three-vendor":["three"],
          "r3f-vendor":["@react-three/fiber","@react-three/drei"],
          "animation-vendor":["gsap","lenis"],
        },
      },
    },
  },
});
