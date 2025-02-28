import { SkImage } from "@shopify/react-native-skia";

export const BLUR_CONTAINER_HEIGHT = 300;
export const BOX_SIZE = 150;

export const Colors = {
  background: "#292929",
  actionButton: "#4D4D4D",
  indicator: "#007AFF",
};

export interface ImagesTemplateProps {
  skiaImages: SkImage[];
  boxHeight?: number;
  showEditor?: boolean;
  flipped?: boolean;
}
