import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";

const { height } = Dimensions.get("window");

const Sidebar = () => {
  return (
    <View style={styles.view}>
      <View style={styles.row}>
      <Pressable style={styles.pressable}>
          <Link href="/views/notification">
          <Text style={styles.buttonText}>notifi</Text>
          </Link>
        </Pressable>

        <Pressable style={styles.pressable}>
          <Link href="/views/createService">
          <Text style={styles.buttonText}>Crer Serv</Text>
          </Link>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() =>
            Alert.alert("Botón presionado", "¡Has presionado el botón!")
          }
        >
          <Text style={styles.buttonText}>boton 3</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() =>
            Alert.alert("Botón presionado", "¡Has presionado el botón!")
          }
        >
          <Text style={styles.buttonText}>boton 4</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textSideBar: {
    color: "#fff",
    textAlign: "center",
    alignContent: "center",
  },
  view: {
    flexDirection: "row",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  pressable: {
    backgroundColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    height: height / 15,
    borderColor: "#e0e0e0",
    borderWidth: 0.3,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default Sidebar;
