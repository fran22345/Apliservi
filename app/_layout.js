import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot, Redirect, useSegments, useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Notifications from "expo-notifications";
import Botombar from "../component/botombar";

export default function Layout() {
  const segments = useSegments();
  const router = useRouter();

  const isAuthRoute = segments[0] === "views";

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  // ---------------------------------------------
  // LISTENER DE NOTIFICACIONES
  // ---------------------------------------------
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        console.log("Notificación tocada:", data);

        if (data?.route && data?.idServicio) {
          router.push({
            pathname: data.route,
            params: { id: data.idServicio }
          });
        }
      }
    );

    return () => subscription.remove();
  }, []);

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

  // ---------------------------------------------
  // CONTENIDO DE LA APP
  // ---------------------------------------------
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <Botombar />
    </View>
  );
}
