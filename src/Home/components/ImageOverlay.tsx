import React from "react";

import { View, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

interface Props {
  selectedItems: number[];
  index: number;
}

export const ImageOverlay = ({ selectedItems, index }: Props) => {
  return (
    <View
      style={{
        height: width / 4,
        width: width / 4,
        backgroundColor: "transparent",
        ...StyleSheet.absoluteFillObject,
        opacity: 1,
        borderWidth: selectedItems.includes(index) ? 3 : 0,
        borderColor: selectedItems.includes(index)
          ? "lightblue"
          : "transparent",
      }}
    />
  );
};
