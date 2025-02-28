import React from "react";
import { Colors } from "../../components/constants";
import { Pressable, Image, Text } from "react-native";

type IconOption = "share" | "flip" | "shade";

interface Props {
  title: string;
  onPress: () => void;
  iconOptions: IconOption;
}

const getImage = (icon: IconOption) => {
  switch (icon) {
    case "flip":
      return require("../../assets/flip.png");
    case "shade":
      return require("../../assets/shade.png");
    case "share":
      return require("../../assets/share.png");
  }
};

export const ActionButton = ({ iconOptions, onPress, title }: Props) => {
  return (
    <Pressable
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.actionButton,
        width: 100,
        height: 100,
        marginHorizontal: 10,
        gap: 8,
      }}
      onPress={onPress}
    >
      <Image
        source={getImage(iconOptions)}
        resizeMode="contain"
        style={{ height: 25, width: 25 }}
      />
      <Text style={{ color: "white" }}>{title}</Text>
    </Pressable>
  );
};
