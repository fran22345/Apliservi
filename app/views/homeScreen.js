import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import Icon from "../../component/iconBar";
import Body from "../../component/body";
import Botombar from "../../component/botombar";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Icon />
      <ScrollView>
        <Body />
        <StatusBar />
      </ScrollView>
      <Botombar />
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
