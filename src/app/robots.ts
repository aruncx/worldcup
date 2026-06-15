import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://worldcup2026.vercel.app'; // Replace with your actual domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Prevent indexing the raw API responses
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
