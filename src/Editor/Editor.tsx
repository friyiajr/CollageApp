import React, { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../components/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionButton } from "./components/ActionButton";
import { HorizontalImageTemplate } from "../components/templates/HorizontalImagesTemplate";
import { useCanvasRef } from "@shopify/react-native-skia";
import { useEditorContext } from "../context/EditorContextProvider";

export const Editor = () => {
  const { top, bottom } = useSafeAreaInsets();

  const ref = useCanvasRef();

  const { imagesData } = useEditorContext();

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <View style={styles.topSection}>
        <View
          style={{
            height: 300,
            width: 300,
            backgroundColor: "black",
          }}
        >
          <HorizontalImageTemplate
            ref={ref}
            boxHeight={300}
            showEditor={true}
            skiaImages={imagesData.images}
          />
        </View>
      </View>
      <View style={styles.bottomSection}>
        <ActionButton onPress={() => {}} title="Share" iconOptions="share" />
        <ActionButton onPress={() => {}} title="Shade" iconOptions="shade" />
        <ActionButton onPress={() => {}} title="Flip" iconOptions="flip" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topSection: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
