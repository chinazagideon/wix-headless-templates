'use client';
import { ServiceImage } from '@app/model/service/service.mapper';
import { media as wixMedia } from '@wix/sdk';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export const getImageUrlForMedia = (
  media?: ServiceImage,
  width: number = 640,
  height: number = 320
) =>
  media?.image
    ? wixMedia.getScaledToFillImageUrl(media.image, width, height, {})
    : null;

// Function to check if an image URL is valid
const checkImageValidity = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Image validation failed:', url, error);
    return false;
  }
};

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateAndSetImage = async () => {
      if (!media?.image) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      const url = wixMedia.getScaledToFillImageUrl(
        media.image,
        width,
        height,
        {}
      );
      if (!url) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      // Check if the image is valid
      const isValidImage = await checkImageValidity(url);
      setIsValid(isValidImage);

      if (isValidImage) {
        setImageUrl(url);
      }

      setIsLoading(false);
    };

    validateAndSetImage();
  }, [media, width, height]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="overflow-hidden cursor-pointer relative group">
          <div className="bg-gray-200 animate-pulse w-full h-full min-h-[200px] rounded-md flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback when image is invalid or not available
  if (!isValid || !imageUrl) {
    return (
      <>
        <div className="flex items-center justify-center">
          <Image
            src="/custom/icando-move-truck.jpg"
            className="object-cover w-full group-hover:brightness-75 transition duration-300 ease-in-out rounded-md"
            alt="Service image"
            width={640}
            height={320}
          />
        </div>
      </>
    );
  }

  // Valid image
  return (
    <div className="flex items-center justify-center">
      <div className="overflow-hidden cursor-pointer relative group">
        <img
          className="object-cover w-full group-hover:brightness-75 transition duration-300 ease-in-out rounded-md"
          style={{ width: width, height: height }}
          src={imageUrl}
          alt="Service image"
          onError={() => {
            // Fallback if image fails to load even after validation
            setIsValid(false);
          }}
        />
      </div>
    </div>
  );
}
