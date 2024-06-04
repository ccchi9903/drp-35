import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { sleep } from "@/utils/utils";
import Dots from "react-native-dots-pagination";
import { BlurView } from "expo-blur";

const IMAGES: ImageSourcePropType[] = [
  require("@/assets/images/ccl422.jpeg"),
  require("@/assets/images/fp522.jpeg"),
  require("@/assets/images/tsy22.jpeg"),
];

const NUM_CARDS = 3;

const TinderSwipe = () => {
  const [index, setIndex] = useState(0);

  const handleTap = (xIndex: number, screenWidth: number) => {
    const quarterWidth = screenWidth / 4;

    if (xIndex >= 0 && xIndex < quarterWidth) {
      setIndex((i) => Math.max(0, i - 1));
    } else if (xIndex >= quarterWidth * 3 && xIndex < screenWidth) {
      setIndex((i) => Math.min(i + 1, IMAGES.length - 1));
    }
  };
  const { width } = Dimensions.get("window");

  const OverlayLabelRight = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: Colors.primary,
            opacity: 0.7,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Ionicons name="happy-outline" size={80} color={Colors.background} />
      </View>
    );
  }, []);

  const ref = useRef<SwiperCardRefType>();

  useEffect(() => console.log(index), [index]);

  const renderCard = (image: ImageSourcePropType) => {
    return (
      <View style={[styles.renderCardContainer, { height: "100%" }]}>
        <TouchableOpacity
          onPress={(e) => {
            handleTap(e.nativeEvent.locationX, width);
          }}
          activeOpacity={1}
        >
          <Image
            source={IMAGES[index]}
            style={styles.renderCardImage}
            resizeMode="cover"
          >
            <View
              style={{
                height: 8,
                gap: 8,
                flexDirection: "row",
                marginTop: 8,
                paddingHorizontal: 12,
              }}
            >
              {Array.from({ length: NUM_CARDS }).map((_, i) => (
                <View
                  style={{ flex: 1, borderRadius: 4, overflow: "hidden" }}
                  key={i}
                >
                  <BlurView
                    tint="extraLight"
                    style={{
                      flex: 1,
                      backgroundColor: `rgba(255,255,255,${
                        index === i ? 0.9 : 0.3
                      })`,
                    }}
                    intensity={80}
                  />
                </View>
              ))}
            </View>
            <View
              style={{
                width: "100%",
                backgroundColor: Colors.background,
                alignSelf: "flex-end",
                position: "absolute",
                bottom: 0,
                padding: 16,
                paddingLeft: 24,
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "600", fontSize: 20 }}>
                Ethan Hosier
              </Text>

              <View style={{ flexDirection: "row", gap: 8 }}>
                <View
                  style={{
                    backgroundColor: Colors.lightGray,
                    height: 32,
                    paddingHorizontal: 12,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontWeight: "500" }}>🇺🇸 🇫🇷</Text>
                </View>
              </View>
            </View>
          </Image>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.subContainer, { width: "100%", height: 600 }]}>
      <Swiper
        translateXRange={[-100, 0, 100]}
        ref={ref}
        disableTopSwipe
        cardStyle={styles.cardStyle}
        data={IMAGES}
        renderCard={renderCard}
        onSwipeRight={(cardIndex) => {
          console.log("cardIndex", cardIndex);
        }}
        onSwipedAll={async () => {
          await sleep(100);
          for (let i = 0; i < NUM_CARDS; i++) {
            ref.current?.swipeBack();
            console.log("swipeBack");
            await sleep(50);
          }
        }}
        onSwipeLeft={(cardIndex) => {
          console.log("onSwipeLeft", cardIndex);
        }}
        onSwipeTop={(cardIndex) => {
          console.log("onSwipeTop", cardIndex);
        }}
        onSwipeActive={() => {
          console.log("onSwipeActive");
        }}
        onSwipeStart={() => {
          console.log("onSwipeStart");
        }}
        onSwipeEnd={() => {
          console.log("onSwipeEnd");
        }}
        OverlayLabelRight={OverlayLabelRight}
      />
    </View>
  );
};

export default TinderSwipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    bottom: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 80,
    borderRadius: 40,
    marginHorizontal: 20,
    aspectRatio: 1,
    backgroundColor: "#3A3D45",
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardStyle: {
    width: "95%",
    height: "75%",
    borderRadius: 15,
    marginVertical: 20,
  },
  renderCardContainer: {
    flex: 1,
    borderRadius: 15,
    height: "75%",
    width: "100%",
  },
  renderCardImage: {
    height: "100%",
    width: "100%",
    borderRadius: 15,
    position: "relative",
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlayLabelContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
});
