import { SIGNAPSE_BUILD_REVISION } from 'astro:env/server';

export const prerender = true;

export function GET() {
  return Response.json({ revision: SIGNAPSE_BUILD_REVISION || null });
}
