import React, { useEffect } from "react";
import { useNavigation } from "expo-router";
import HomeScreen from "./views/homeScreen";

export default function App() {
  
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return <HomeScreen />;
}
