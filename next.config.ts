import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-сервер: разрешаем открывать превью с телефона по IP в локальной сети
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
