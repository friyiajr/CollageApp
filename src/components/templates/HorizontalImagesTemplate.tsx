import {
  Canvas,
  ImageShader,
  Rect,
  rotate,
  RoundedRect,
  Shader,
  Skia,
  SkiaDomView,
  vec,
} from "@shopify/react-native-skia";
import React, { forwardRef, RefObject, useEffect, useState } from "react";
import { BOX_SIZE, Colors, ImagesTemplateProps } from "../constants";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useEditorContext } from "../../context/EditorContextProvider";

type Position = "first" | "second" | "third" | "none";
type MiddlePullState = "none" | "top" | "bottom";

const nothingSource = Skia.RuntimeEffect.Make(`
  uniform shader image;
   
  half4 main(vec2 xy) {   
    return image.eval(xy);
  }`)!;

const source = Skia.RuntimeEffect.Make(`
    uniform shader image;
     
    half4 main(vec2 xy) {   
      xy.x += sin(xy.y / 3) * 4;
      return image.eval(xy).rbga;
    }`)!;

export const HorizontalImageTemplate = forwardRef<
  SkiaDomView,
  ImagesTemplateProps
>(({ skiaImages, showEditor = false, boxHeight = BOX_SIZE }, ref) => {
  const { setModifiers, modifiers } = useEditorContext();

  const defaultHeight = boxHeight / 3;
  const topHeight = useSharedValue(defaultHeight);
  const middleHeight = useSharedValue(defaultHeight);
  const middleTopBorder = useSharedValue(defaultHeight);
  const bottomHeight = useSharedValue(defaultHeight);
  const bottomTopBorder = useSharedValue(defaultHeight * 2);
  const position = useSharedValue<Position>("none");
  const middlePullStatus = useSharedValue<MiddlePullState>("none");

  const firstTransformationState = useSharedValue([{ rotate: 0 }]);
  const secondTransformationState = useSharedValue([{ rotate: 0 }]);
  const thirdTransformationState = useSharedValue([{ rotate: 0 }]);

  const [shaderState, setShaderState] = useState({
    first: false,
    second: false,
    third: false,
  });

  const updateModifiers = (position: Position) => {
    setModifiers({
      ...modifiers,
      flip: () => {
        if (position === "first") {
          firstTransformationState.value =
            firstTransformationState.value[0].rotate === Math.PI
              ? [{ rotate: 0 }]
              : [{ rotate: Math.PI }];
        } else if (position === "second") {
          secondTransformationState.value =
            secondTransformationState.value[0].rotate === Math.PI
              ? [{ rotate: 0 }]
              : [{ rotate: Math.PI }];
        } else if (position === "third") {
          thirdTransformationState.value =
            thirdTransformationState.value[0].rotate === Math.PI
              ? [{ rotate: 0 }]
              : [{ rotate: Math.PI }];
        }
      },
      shade: () => {
        if (position === "first") {
          setShaderState({
            ...shaderState,
            first: !shaderState.first,
          });
        } else if (position === "second") {
          setShaderState({
            ...shaderState,
            second: !shaderState.second,
          });
        } else if (position === "third") {
          setShaderState({
            ...shaderState,
            third: !shaderState.third,
          });
        }
      },
    });
  };

  useEffect(() => {
    updateModifiers(position.value);
  }, [shaderState]);

  const firstInnerRect = useDerivedValue(() => {
    return {
      x: 0,
      y: 0,
      height: topHeight.value,
      width: boxHeight,
    };
  }, [topHeight]);

  const secondInnerRect = useDerivedValue(() => {
    return {
      x: 0,
      y: middleTopBorder.value,
      height: middleHeight.value,
      width: boxHeight,
    };
  }, [topHeight]);

  const thirdInnerRect = useDerivedValue(() => {
    return {
      x: 0,
      y: bottomTopBorder.value,
      height: bottomHeight.value,
      width: boxHeight,
    };
  }, [topHeight]);

  const colorWrapperPosition = useDerivedValue(() => {
    switch (position.value) {
      case "first":
      case "none":
        return 0;
      case "second":
        return middleTopBorder.value;
      case "third":
        return bottomTopBorder.value;
    }
  }, [position]);

  const indicatorWrapperHeight = useDerivedValue(() => {
    switch (position.value) {
      case "first":
      case "none":
        return topHeight.value;
      case "second":
        return middleHeight.value;
      case "third":
        return bottomHeight.value;
    }
  }, []);

  const indicatorPosition = useDerivedValue(() => {
    if (position.value === "first" || position.value === "none") {
      return colorWrapperPosition.value + topHeight.value - 7.5;
    } else {
      return colorWrapperPosition.value - 7.5;
    }
  }, [topHeight]);

  const middleBottomIndicatorPosition = useDerivedValue(() => {
    if (position.value === "second") {
      return indicatorPosition.value + middleHeight.value;
    } else {
      return -boxHeight;
    }
  }, [indicatorPosition]);

  const gesture = Gesture.Pan()
    .onBegin(({ y }) => {
      if (y > 0 && y < middleTopBorder.value) {
        position.value = "first";
      } else if (y > middleTopBorder.value && y < bottomTopBorder.value) {
        position.value = "second";
      } else {
        position.value = "third";
      }

      runOnJS(updateModifiers)(position.value);
    })
    .onChange(({ y, changeY }) => {
      if (y > 0 && y < middleTopBorder.value) {
        topHeight.value += changeY;
        middleTopBorder.value += changeY;
        middleHeight.value = middleHeight.value - changeY;
      } else if (y > middleTopBorder.value && y < bottomTopBorder.value) {
        if (
          y < middleTopBorder.value + middleHeight.value / 2 &&
          middlePullStatus.value === "none"
        ) {
          middlePullStatus.value = "top";
        }
        if (
          y >= middleTopBorder.value + middleHeight.value / 2 &&
          middlePullStatus.value === "none"
        ) {
          middlePullStatus.value = "bottom";
        }

        if (middlePullStatus.value === "top") {
          topHeight.value += changeY;
          middleTopBorder.value += changeY;
          middleHeight.value = middleHeight.value - changeY;
        } else if (middlePullStatus.value === "bottom") {
          bottomHeight.value -= changeY;
          bottomTopBorder.value += changeY;
          middleHeight.value = middleHeight.value + changeY;
        }
      } else {
        bottomHeight.value -= changeY;
        bottomTopBorder.value += changeY;
        middleHeight.value = middleHeight.value + changeY;
      }
    })
    .onEnd(() => {
      middlePullStatus.value = "none";
    });

  const firstTransformationOrigin = useDerivedValue(() => {
    return vec(boxHeight / 2, topHeight.value / 2);
  }, [topHeight]);

  const secondTransformationOrigin = useDerivedValue(() => {
    return vec(boxHeight / 2, middleTopBorder.value + middleHeight.value / 2);
  }, [topHeight]);

  const thirdTransformationOrigin = useDerivedValue(() => {
    return vec(boxHeight / 2, bottomTopBorder.value + bottomHeight.value / 2);
  }, [topHeight]);

  return (
    <GestureDetector gesture={gesture}>
      <Canvas ref={ref as RefObject<SkiaDomView>} style={{ flex: 1 }}>
        <Rect
          origin={firstTransformationOrigin}
          transform={firstTransformationState}
          height={topHeight}
          width={boxHeight}
          x={0}
          y={0}
        >
          <Shader source={shaderState.first ? source : nothingSource}>
            <ImageShader
              image={skiaImages[0]}
              fit="cover"
              rect={firstInnerRect}
            />
          </Shader>
        </Rect>
        <Rect
          transform={secondTransformationState}
          origin={secondTransformationOrigin}
          height={middleHeight}
          width={boxHeight}
          x={0}
          y={middleTopBorder}
        >
          <Shader source={shaderState.second ? source : nothingSource}>
            <ImageShader
              image={skiaImages[1]}
              fit="cover"
              rect={secondInnerRect}
            />
          </Shader>
        </Rect>
        <Rect
          transform={thirdTransformationState}
          origin={thirdTransformationOrigin}
          height={bottomHeight}
          width={boxHeight}
          x={0}
          y={bottomTopBorder}
        >
          <Shader source={shaderState.third ? source : nothingSource}>
            <ImageShader
              image={skiaImages[2]}
              fit="cover"
              rect={thirdInnerRect}
            />
          </Shader>
        </Rect>
        {showEditor && (
          <>
            <Rect
              style="stroke"
              strokeWidth={3}
              height={indicatorWrapperHeight}
              width={boxHeight}
              x={0}
              y={colorWrapperPosition}
              color={Colors.indicator}
            />
            <RoundedRect
              height={15}
              width={100}
              x={boxHeight / 2 - 50}
              y={indicatorPosition}
              color={Colors.indicator}
              r={10}
            />
            <RoundedRect
              height={15}
              width={100}
              x={boxHeight / 2 - 50}
              y={middleBottomIndicatorPosition}
              color={Colors.indicator}
              r={10}
            />
          </>
        )}
      </Canvas>
    </GestureDetector>
  );
});
