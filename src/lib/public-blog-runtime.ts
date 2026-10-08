import { env } from 'cloudflare:workers';

export function publicBlogApiOrigin() {
  const origin = env.PUBLIC_BLOG_API_ORIGIN;
  if (!origin) {
    throw new Error('PUBLIC_BLOG_API_ORIGIN is required for blog requests.');
  }
  return origin;
}
