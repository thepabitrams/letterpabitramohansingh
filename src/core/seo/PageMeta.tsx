// src/core/seo/PageMeta.tsx

import { OG_IMAGE_URL, SITE_NAME, SITE_URL } from './constants'

interface PageMetaProps {
  title: string
  description: string
  path: string
  structuredData?: Record<string, unknown>
}

export function PageMeta({
  title,
  description,
  path,
  structuredData,
}: PageMetaProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const canonicalUrl = `${SITE_URL}${path}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={OG_IMAGE_URL} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE_URL} />

      {structuredData ? (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      ) : null}
    </>
  )
}