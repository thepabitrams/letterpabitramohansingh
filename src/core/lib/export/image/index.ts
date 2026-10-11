/* src/core/lib/export/image/index.ts */
import { snapdom } from '@zumer/snapdom'

export async function captureLetterAsImage(element: HTMLElement): Promise<string> {
  const imageElement = await snapdom.toPng(element, {
    scale: 2,
  })

  return imageElement.src
}

export function downloadDataUrl(dataUrl: string, fileName: string): void {
  const downloadLink = document.createElement('a')
  downloadLink.href = dataUrl
  downloadLink.download = fileName
  downloadLink.style.display = 'none'

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}