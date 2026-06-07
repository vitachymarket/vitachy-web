/**
 * Reescribe una URL del CDN de Amazon (m.media-amazon.com/images/I/{id}{._SX...}?.jpg)
 * para forzar un tamaño de salida.
 *
 * Si la URL no es de Amazon o no tiene la forma esperada, se devuelve tal cual.
 * Si ya trae un sufijo (._AC_SX1500_, ._SL2000_, etc.) se reemplaza.
 *
 * Tamaño = lado mayor en pixeles. Amazon CDN escala manteniendo aspect ratio.
 */
export function resizedAmazonImage(url: string, size: number): string {
  if (!url.includes('m.media-amazon.com/images/')) return url;
  const match = url.match(/^(.+?)(?:\._[A-Z0-9,_]+_)?\.(jpg|jpeg|png)$/i);
  if (!match) return url;
  const [, base, ext] = match;
  return `${base}._SL${size}_.${ext}`;
}
