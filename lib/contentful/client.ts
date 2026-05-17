import { createClient } from 'contentful';

let cachedClient: any = null;


export function getContentfulClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    throw new Error(
      'Missing Contentful credentials: NEXT_PUBLIC_CONTENTFUL_SPACE_ID and NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN'
    );
  }

  cachedClient = createClient({
    space: spaceId,
    accessToken,
  });

  return cachedClient;
}


export function getContentfulPreviewClient() {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

  if (!spaceId || !previewToken) {
    console.warn('[Contentful] Preview token not configured, using default client');
    return getContentfulClient();
  }

  return createClient({
    space: spaceId,
    accessToken: previewToken,
    host: 'preview.contentful.com',
  });
}


export function resetContentfulClient() {
  cachedClient = null;
}
