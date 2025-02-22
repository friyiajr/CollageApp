import React from "react";

import { Dimensions, Image } from "react-native";

const { width } = Dimensions.get("window");

interface Props {
  item: string;
}

export const ImagePlaceholder = ({ item }: Props) => {
  return (
    <Image
      style={{
        width: width / 4,
        height: width / 4,
        resizeMode: "cover",
      }}
      source={require("../../assets/layouts.png")}
    />
  );
};
