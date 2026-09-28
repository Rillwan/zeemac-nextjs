const SITE_URL = 'https://www.zeemacgroup.com';

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
