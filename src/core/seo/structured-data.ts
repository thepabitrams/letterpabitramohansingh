// src/core/seo/structured-data.ts

import {
  AUTHOR_NAME,
  OG_IMAGE_URL,
  PORTFOLIO_URL,
  SITE_NAME,
  SITE_URL,
  SOCIALS,
} from './constants'

const SOCIAL_PROFILES = [
  SOCIALS.github,
  SOCIALS.linkedin,
  SOCIALS.twitter,
  SOCIALS.instagram,
]

export function buildOrganizationSchema() {
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: OG_IMAGE_URL,
    founder: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: PORTFOLIO_URL,
    },
    sameAs: SOCIAL_PROFILES,
  }
}

export function buildWebsiteSchema() {
  return {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function buildHomeSchemaGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildOrganizationSchema(), buildWebsiteSchema()],
  }
}

export function buildAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${SITE_NAME}`,
    url: `${SITE_URL}/about`,
    mainEntity: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: PORTFOLIO_URL,
      sameAs: SOCIAL_PROFILES,
    },
  }
}