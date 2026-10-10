"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowIcon } from "./arrow-icon";
import { GalleryPhoto, type GalleryItem } from "./gallery-photo";

export function GalleryCascade({ photos, label }: { photos: readonly GalleryItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = photos[active];
  const move = (step: number) => setActive((current) => (current + step + photos.length) % photos.length);
  useEffect(() => {
    if (!expanded) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = before; };
  }, [expanded]);
  const keys = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
    }
  };
  return <div className="professional-cascade" role="region" aria-roledescription="carousel" aria-label={`${label} photographs`} onKeyDown={keys}>
    <div className="gallery-slideshow-stage">
      <button className="gallery-slide-arrow" type="button" aria-label={`Previous ${label} photograph`} onClick={() => move(-1)}><ArrowIcon direction="previous" /></button>
      <div className="professional-cascade-stack">
        {[2, 1].map(offset => <div className={`professional-cascade-back layer-${offset}`} key={offset} aria-hidden="true" />)}
        <button className="professional-cascade-front" type="button" aria-label={`View full photograph: ${photo.title}`} onClick={() => { dialog.current?.showModal(); setExpanded(true); }}><GalleryPhoto photo={photo} full /></button>
      </div>
      <button className="gallery-slide-arrow" type="button" aria-label={`Next ${label} photograph`} onClick={() => move(1)}><ArrowIcon direction="next" /></button>
    </div>
    <div className="gallery-slideshow-caption" aria-live="polite" aria-atomic="true"><h3>{photo.title}</h3><p>{photo.description}</p><span>{active + 1} / {photos.length}</span></div>
    <div className="gallery-slideshow-dots" aria-label={`Choose a ${label} photograph`}>{photos.map((item, index) => <button type="button" key={item.id} aria-label={`Show ${item.title}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />)}</div>
    <dialog ref={dialog} className="gallery-dialog" aria-label={`${label} photograph viewer`} onClose={() => setExpanded(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => { event.stopPropagation(); keys(event); }}>
      {expanded && <div className="gallery-dialog-panel"><header><span>{label} · {active + 1} / {photos.length}</span><button type="button" aria-label="Close photograph viewer" onClick={() => dialog.current?.close()}>×</button></header><div className="gallery-dialog-image"><button type="button" aria-label="Previous photograph" onClick={() => move(-1)}><ArrowIcon direction="previous" /></button><GalleryPhoto photo={photo} full eager /><button type="button" aria-label="Next photograph" onClick={() => move(1)}><ArrowIcon direction="next" /></button></div><footer aria-live="polite"><h2>{photo.title}</h2><a href={photo.src} target="_blank" rel="noreferrer">Open full image <ArrowIcon direction="right" /></a></footer></div>}
    </dialog>
  </div>;
}
