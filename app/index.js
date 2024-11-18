import React, { useEffect } from "react";
import { useNavigation } from "expo-router";
import HomeScreen from "./views/homeScreen";
import { View, Text } from "react-native";
import usePushNotification from "../usePushNotification";

export default function App() {
  const { expoPushToken, notification } = usePushNotification();
  const data = JSON.stringify({ notification });

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View>
      <Text>Token: {expoPushToken?.data ?? ""}</Text>;
      <Text>{data}</Text>;
      <HomeScreen />;
    </View>
  );
}
