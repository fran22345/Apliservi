import { useSafeNavigation } from "../hooks/navigation";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";

const { height } = Dimensions.get("window");

const Botombar = () => {
  const safeNavigate = useSafeNavigation();
  return (
    <View style={styles.view}>
      <View style={styles.row}>
        <Pressable
          style={styles.pressable}
          onPress={() => safeNavigate("/views/homeScreen", true)}>
          <Text style={styles.buttonText}>Home</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => safeNavigate("/views/createService", true)}>
          <Text style={styles.buttonText}>Crer Serv</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => safeNavigate("/views/serviciosActivos", true)}>
          <Text style={styles.buttonText}>Prestaciones</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => safeNavigate("/views/serviciosContratados", true)}>
          <Text style={styles.buttonText}>Contratos</Text>
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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

export default Botombar;
