import React from "react";
import { StyleSheet } from "react-native";
import { View, Dimensions } from "react-native";
import Card from "./card";

const { width, height } = Dimensions.get("window");

const Body = () => {
  return (
    <View style={Style.content}>
      <Card/>
    </View>
  );
};
const Style = StyleSheet.create({
  textSideBar: {
    color: "#fff",
  },
  content: {
    backgroundColor: "#e0e0e0",
    height: height,
    width: width,
    flexDirection:'column'

  },
});
export default Body;
