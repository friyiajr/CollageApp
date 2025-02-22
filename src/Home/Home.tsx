import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { BLUR_CONTAINER_HEIGHT, Colors } from "../components/constants";
import { ImagePlaceholder } from "./components/ImagePlaceholder";
import { ImageOverlay } from "./components/ImageOverlay";
import { usePhotos } from "./hooks/usePhotos";

const { height, width } = Dimensions.get("window");

export const Home = () => {
  const { push } = useNavigation<any>();

  const { albumPhotos } = usePhotos();

  return (
    <>
      <FlatList
        style={styles.background}
        data={albumPhotos}
        numColumns={4}
        ListEmptyComponent={
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
              top: height / 2 + BLUR_CONTAINER_HEIGHT / 2,
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        }
        ListHeaderComponent={
          <View style={{ width: "100%", height: BLUR_CONTAINER_HEIGHT }} />
        }
        renderItem={({ item, index }) => {
          return (
            <Pressable>
              <ImagePlaceholder item={item} />
              <ImageOverlay selectedItems={[]} index={index} />
            </Pressable>
          );
        }}
      />
      <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
        <Image
          source={require("../assets/layouts.png")}
          resizeMode="cover"
          style={{
            height: 150,
            width: 150,
          }}
        />
      </BlurView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: Colors.background,
  },
  blurContainer: {
    width: width,
    height: BLUR_CONTAINER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});
