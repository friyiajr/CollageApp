import { SkImage } from "@shopify/react-native-skia";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type TemplateType = "horizontal" | "vertical" | "square";

interface EditorDataType {
  images: SkImage[];
}

interface EditorContextType {
  imagesData: EditorDataType;
  setImageData: React.Dispatch<React.SetStateAction<EditorDataType>>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [imagesData, setImageData] = useState<EditorDataType>({
    images: [],
  });

  return (
    <EditorContext.Provider value={{ imagesData, setImageData }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
