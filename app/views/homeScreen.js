import {
  View,

  StatusBar,
  StyleSheet,
} from "react-native";
import Icon from "../../component/iconBar";
import Body from "../../component/body";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Icon />
    
        <Body />
        <StatusBar />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default HomeScreen;
