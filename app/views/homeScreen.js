import React from "react";
import { View, ScrollView, StatusBar, StyleSheet } from "react-native";
import Icon from "../../component/iconBar";
import Body from "../../component/body";
import Sidebar from "../../component/sidebar";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Icon />
      <ScrollView>
        <Body />
        <StatusBar />
      </ScrollView>
      <Sidebar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default HomeScreen;
