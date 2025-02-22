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

  return {
    albumPhotos,
  };
};
