import { Skia, SkImage } from "@shopify/react-native-skia";
import { readAsStringAsync } from "expo-file-system";
import {
  getAssetInfoAsync,
  getAssetsAsync,
  usePermissions,
} from "expo-media-library";
import { useEffect, useState } from "react";

export const usePhotos = () => {
  const [permissionResponse, requestPermission] = usePermissions();
  const [albumPhotos, setAlbumPhotos] = useState<string[]>([]);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [skiaImages, setSkiaImages] = useState<SkImage[]>([]);

  async function getPhotos() {
    if (permissionResponse?.status !== "granted") {
      await requestPermission();
    }

    const allPhotosAssets = await getAssetsAsync({
      mediaType: "photo",
    });

    const base64Data: string[] = [];

    for (const photoAsset of allPhotosAssets.assets) {
      const info = await getAssetInfoAsync(photoAsset);
      const base64 = await readAsStringAsync(info.localUri!, {
        encoding: "base64",
      });
      base64Data.push(base64);
    }

    setAlbumPhotos(base64Data);
  }

  useEffect(() => {
    getPhotos();
  }, []);

  useEffect(() => {
    if (selectedImages.length > 0) {
      const allImages = [];
      for (const selectedImage of selectedImages) {
        const data = Skia.Data.fromBase64(selectedImage)!;
        const image = Skia.Image.MakeImageFromEncoded(data)!;
        allImages.push(image);
      }
      setSkiaImages(allImages);
    }
  }, [selectedImages]);

  const onItemSelected = (index: number) => {
    if (selectedItems.length < 3 && !selectedItems.includes(index)) {
      setSelectedItems([...selectedItems, index]);
      setSelectedImages([...selectedImages, albumPhotos[index]]);
    }
    if (selectedItems.includes(index)) {
      const newImages = [...selectedImages];
      const newSkiaImages = [...skiaImages];

      const indexToRemove = selectedItems.findIndex((item) => item === index);
      newImages.splice(indexToRemove, 1);
      newSkiaImages.splice(indexToRemove, 1);

      setSelectedImages(newImages);
      setSkiaImages(newSkiaImages);

      const newIndicies = selectedItems.filter((item) => item !== index);
      setSelectedItems(newIndicies);
    }
  };

  return {
    albumPhotos,
    selectedImages,
    selectedItems,
    skiaImages,
    onItemSelected,
  };
};
