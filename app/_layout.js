import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot, Redirect, useSegments } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import Botombar from "../component/botombar";
import useNotificationNavigation from "../app/hooks/useNotificationNavigation";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  const segments = useSegments();
  const isAuthRoute = segments[0] === "views";

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useNotificationNavigation();

  // ---------------------------------------------
  // CHECKEO DE SESIÓN GOOGLE
  // ---------------------------------------------
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

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------
  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ---------------------------------------------
  // REDIRECCIÓN SI NO HAY USER
  // ---------------------------------------------
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
