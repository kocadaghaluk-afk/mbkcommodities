import Image from "next/image";
import { Reveal } from "./Reveal";

interface EditorialImageProps {
  src: string;
  alt: string;
  /** e.g. "16/9", "4/3", "1/1" — enforced via CSS aspect-ratio. */
  aspectRatio?: string;
  className?: string;
  priority?: boolean;
  /** Applies a dark overlay suitable for text placed over the image. */
  overlay?: boolean;
  sizes?: string;
  animate?: boolean;
  /**
   * Applies the site's standard editorial color grade (a quiet
   * desaturation) so every photograph — placeholder or approved — reads
   * as part of one considered set. Per Brand Bible 5.1: "Desaturated,
   * cool-neutral base grade." Disable only for an image that must stay
   * full color for a specific, deliberate reason.
   */
  grade?: boolean;
  /**
   * CSS object-position, e.g. "center 35%", "center top". A naive dead-
   * center crop is rarely the right one for infrastructure photography
   * (which usually reads better with headroom bias toward the upper
   * third, keeping horizon/structure rather than foreground) or portraits
   * (which need headroom, not a centered face). Defaults to true center
   * only where no better anchor is specified — every call site should set
   * one deliberately once real photography is composed.
   */
  focalPoint?: string;
}

export function EditorialImage({
  src,
  alt,
  aspectRatio = "3/2",
  className = "",
  priority = false,
  overlay = false,
  sizes = "100vw",
  animate = true,
  grade = true,
  focalPoint = "center",
}: EditorialImageProps) {
  const image = (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectPosition: focalPoint }}
        className={`object-cover ${grade ? "grayscale-[12%] contrast-[1.02]" : ""}`}
      />
      {overlay && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
        />
      )}
    </div>
  );

  if (!animate) return image;

  return (
    <Reveal variant="image-scale" className="overflow-hidden">
      {image}
    </Reveal>
  );
}
