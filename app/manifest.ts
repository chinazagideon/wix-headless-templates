import { MetadataRoute } from 'next';
import { constants } from '@app/components/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: constants.companyName,
    short_name: 'ICANDO Movers',
    description: constants.aboutDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#FF6B35',
    icons: [
      {
        src: '/custom/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/custom/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
