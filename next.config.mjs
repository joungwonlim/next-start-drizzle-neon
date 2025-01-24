import createJiti from "jiti";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./env/server.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
