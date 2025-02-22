import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Pressable } from "react-native";

export const Home = () => {
  const { push } = useNavigation<any>();

  return (
    <Pressable
      onPress={() => {
        push("Editor");
      }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Home</Text>
    </Pressable>
  );
};
