import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GitPub',
    short_name: 'GitPub',
    description: 'Brewery Locator and Journal',
    start_url: '/',
    display: 'standalone',
    background_color: '#18181b',
    theme_color: '#b45309',
    icons: [
      {
        src: '/assets/images/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/images/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
