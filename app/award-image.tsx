import type { AwardImage } from "./awards-data";

export function AwardPhoto({ image, alt, thumbnail = false }: { image: AwardImage; alt: string; thumbnail?: boolean }) {
  return <picture>
    {!thumbnail && <source srcSet={image.avif} type="image/avif" />}
    {/* Pre-encoded formats avoid a second transformation of certificate lettering. */}
    <img src={thumbnail ? image.thumbnail : image.src} width={image.width} height={image.height} alt={alt} loading="lazy" decoding="async" />
  </picture>;
}
