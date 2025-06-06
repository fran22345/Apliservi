import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Notification = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is a basic notification component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0e0e0",
    height: height,
    width: width,
    flexDirection: "column",
  },
  text: {
    marginTop: 5,
    marginRight: 10,
    marginBottom: 5,
    marginLeft: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default Notification;
