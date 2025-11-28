import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot, Redirect, useSegments } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Botombar from "../component/botombar";

export default function Layout() {
  const segments = useSegments();
  const isAuthRoute = segments[0] === "views";

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      try {
        const currentUser = GoogleSignin.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error al chequear sesión:", error);
      } finally {
        setChecking(false);
      }
    };

    if (!isAuthRoute) checkUser();
    else setChecking(false);
  }, [isAuthRoute]);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthRoute && !user) {
    return <Redirect href="/views/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <Botombar />
    </View>
  );
}
