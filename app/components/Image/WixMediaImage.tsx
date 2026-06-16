'use client';
import Image from 'next/image';
import { media as wixMedia } from '@wix/sdk';
import { useState } from 'react';
import { ServiceImage } from '@app/model/service/service.mapper';

export const getImageUrlForMedia = (
  media?: ServiceImage,
  width: number = 640,
  height: number = 320
) =>
  media?.image
    ? wixMedia.getScaledToFillImageUrl(media.image, width, height, {})
    : null;

export default function WixMediaImage({
  media,
  width = 640,
  height = 320,
  fallbackText = 'Image not available',
}: {
  media?: ServiceImage;
  width?: number;
  height?: number;
  fallbackText?: string;
}) {
  const [errored, setErrored] = useState(false);

  const url =
    !errored && media?.image
      ? wixMedia.getScaledToFillImageUrl(media.image, width, height, {})
      : null;

  return (
    <div className="flex items-center justify-center overflow-hidden">
      <Image
        src={url ?? '/custom/icando-move-truck.jpg'}
        alt="Service image"
        width={width}
        height={height}
        className="object-cover w-full rounded-md group-hover:brightness-75 transition duration-300 ease-in-out"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
