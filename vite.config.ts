import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))

function googleFontsInjection() {
  return {
    name: 'google-fonts-injection',
    transformIndexHtml(html: string) {
      const variantsDir = join(currentDir, 'src/letter/text/variants')
      const files = readdirSync(variantsDir).filter((file) => file.endsWith('.ts'))

      const fontUrls = new Set<string>()
      const fontFamilyCss: string[] = []

      for (const file of files) {
        const fileContent = readFileSync(join(variantsDir, file), 'utf-8')

        const urlMatches = fileContent.matchAll(/fontUrl:\s*['"`]([^'"`]+)['"`]/g)
        for (const match of urlMatches) {
          if (match[1]) fontUrls.add(match[1])
        }

        const cssMatches = fileContent.matchAll(/fontFamilyCss:\s*[`'"]([^`'"]+)[`'"]/g)
        for (const match of cssMatches) {
          if (match[1]) fontFamilyCss.push(match[1])
        }
      }

      const fontLinks = Array.from(fontUrls)
        .map((url) => `    <link rel="stylesheet" href="${url}">`)
        .join('\n')

      const fontStyles = fontFamilyCss.length
        ? `    <style>\n      ${fontFamilyCss.join('\n      ')}\n    </style>`
        : ''

      const injectedMarkup = [fontLinks, fontStyles].filter(Boolean).join('\n')

      return html.replace('</head>', `${injectedMarkup}\n  </head>`)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cloudflare(),
    googleFontsInjection(),
  ],
})