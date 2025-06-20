import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()  , tailwindcss(),],
  server: {
    host: "0.0.0.0",  // เปิดให้เข้าถึงผ่าน Public IP
    port: 5555,       // เปลี่ยนพอร์ตได้ตามต้องการ
  },
  
})
