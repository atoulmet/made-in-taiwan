import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Site entièrement statique : `npm run build` écrit le site dans `out/`,
     déposable sur n'importe quel hébergeur de fichiers. */
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
