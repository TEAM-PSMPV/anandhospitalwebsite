"use client";
import { useEffect, useRef, useState } from "react";
import { GalleryPhoto, type GalleryItem } from "./gallery-photo";

export function GalleryCollection({ photos, label }: { photos: readonly GalleryItem[]; label: string }) {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = active === null ? null : photos[active];
  const move = (step: number) => setActive((current) => current === null ? null : (current + step + photos.length) % photos.length);
  useEffect(() => {
    const element = dialog.current;
    if (active !== null && !element?.open) element?.showModal();
    if (active === null && element?.open) element.close();
  }, [active]);
  useEffect(() => {
    if (active === null) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = before; };
  }, [active]);
  return <>
    <div className="hospital-gallery-grid">{photos.map((item) => <figure key={item.id}><button type="button" aria-label={`View full photograph: ${item.title}`} onClick={() => setActive(photos.indexOf(item))}><GalleryPhoto photo={item} /><span className="gallery-open" aria-hidden="true">↗</span></button><figcaption><h3>{item.title}</h3><p>{item.description}</p></figcaption></figure>)}</div>
    <dialog ref={dialog} className="gallery-dialog" aria-label={`${label} photograph viewer`} onClose={() => setActive(null)} onClick={(event) => { if (event.target === event.currentTarget) setActive(null); }} onKeyDown={(event) => { if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } if (event.key === "ArrowRight") { event.preventDefault(); move(1); } }}>
      {photo && <div className="gallery-dialog-panel"><header><span>{label} · {(active ?? 0) + 1} / {photos.length}</span><button type="button" onClick={() => setActive(null)} aria-label="Close photograph viewer">×</button></header><div className="gallery-dialog-image"><button type="button" onClick={() => move(-1)} aria-label="Previous photograph">‹</button><GalleryPhoto photo={photo} full eager /><button type="button" onClick={() => move(1)} aria-label="Next photograph">›</button></div><footer aria-live="polite"><div><h2>{photo.title}</h2><p>{photo.description}</p></div><a href={photo.src} target="_blank" rel="noreferrer">Open full image ↗</a></footer></div>}
    </dialog>
  </>;
}
