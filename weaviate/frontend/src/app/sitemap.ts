import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const url = 'https://xkcd-search.pages.dev';
  return [
    {
      url,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: url + '/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
  ]
}
