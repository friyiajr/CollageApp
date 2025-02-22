import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./src/Home/Home";
import { Editor } from "./src/Editor/Editor";
import { createStaticNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        headerShown: false,
      },
    },
    Editor: {
      screen: Editor,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StatusBar hidden />
        <Navigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
