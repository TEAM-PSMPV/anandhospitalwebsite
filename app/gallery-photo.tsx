export type GalleryItem = { id: string; group: string; title: string; description: string; src: string; avif: string; thumbnail: string; thumbnailAvif?: string; width: number; height: number };

export function GalleryPhoto({ photo, full = false, eager = false }: { photo: GalleryItem; full?: boolean; eager?: boolean }) {
  return <picture><source srcSet={full ? photo.avif : photo.thumbnailAvif ?? photo.avif} type="image/avif" /><img src={full ? photo.src : photo.thumbnail} width={photo.width} height={photo.height} alt={photo.title} loading={eager ? "eager" : "lazy"} decoding="async" /></picture>;
}
