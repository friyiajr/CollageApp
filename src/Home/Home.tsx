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
import {
  BLUR_CONTAINER_HEIGHT,
  BOX_SIZE,
  Colors,
} from "../components/constants";
import { ImagePlaceholder } from "./components/ImagePlaceholder";
import { ImageOverlay } from "./components/ImageOverlay";
import { usePhotos } from "./hooks/usePhotos";
import { useEditorContext } from "../context/EditorContextProvider";
import { HorizontalImageTemplate } from "../components/templates/HorizontalImagesTemplate";

const { height, width } = Dimensions.get("window");

export const Home = () => {
  const { push } = useNavigation<any>();

  const { setImageData } = useEditorContext();

  const { albumPhotos, selectedItems, onItemSelected, skiaImages } =
    usePhotos();

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
            <Pressable onPress={() => onItemSelected(index)}>
              <ImagePlaceholder item={item} />
              <ImageOverlay selectedItems={selectedItems} index={index} />
            </Pressable>
          );
        }}
      />
      <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
        {skiaImages.length === 0 ? (
          <Image
            source={require("../assets/layouts.png")}
            resizeMode="cover"
            style={{
              height: BOX_SIZE,
              width: BOX_SIZE,
            }}
          />
        ) : (
          <Pressable
            onPress={() => {
              setImageData({ images: skiaImages });
              push("Editor");
            }}
            style={{
              height: BOX_SIZE,
              width: BOX_SIZE,
              backgroundColor: "black",
            }}
          >
            <HorizontalImageTemplate
              skiaImages={skiaImages}
              boxHeight={BOX_SIZE}
              showEditor={false}
            />
          </Pressable>
        )}
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
