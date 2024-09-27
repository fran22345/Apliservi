import { View, StyleSheet, ScrollView, StatusBar } from "react-native";
import Sidebar from "../component/sidebar";
import Icon from "../component/iconBar";
import Body from "../component/body";
import { Stack } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{headerShown:false}} />
      <Icon />
      <ScrollView>
        <Body />
        <StatusBar />
      </ScrollView>
      <Sidebar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
