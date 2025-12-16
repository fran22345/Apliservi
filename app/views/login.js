import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Button, Platform } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";

/* ----------------------------------------------------
   PUSH NOTIFICATIONS
---------------------------------------------------- */
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    console.log("Push notifications requieren dispositivo físico");
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permisos de notificaciones no concedidos");
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.log("Project ID no encontrado");
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch (err) {
    console.log("Error obteniendo push token:", err);
    return null;
  }
}

/* ----------------------------------------------------
   LOGIN
---------------------------------------------------- */
const Login = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });

    const currentUser = GoogleSignin.getCurrentUser();
    if (currentUser) {
      setUser(currentUser.user);
      router.replace("/views/homeScreen");
    }
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const result = await GoogleSignin.signIn();
      const googleUser = result.user;

      setUser(googleUser);

      const expoPushToken = await registerForPushNotificationsAsync();

      await axios.post(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/users`,
        {
          googleId: googleUser.id,
          nombre: googleUser.givenName,
          apellido: googleUser.familyName,
          linkFoto: googleUser.photo,
          email: googleUser.email,
          expoPushToken,
        }
      );

      router.replace("/views/homeScreen");
    } catch (error) {
      console.log("Error en login:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (error.code === statusCodes.IN_PROGRESS) return;
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) return;
    }
  };

  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>{user.name}</Text>
          <Text style={styles.userInfoText}>{user.email}</Text>
          <Image source={{ uri: user.photo }} style={styles.userInfoImage} />

          <Button
            title="Cerrar sesión"
            onPress={async () => {
              await GoogleSignin.revokeAccess();
              await GoogleSignin.signOut();
              setUser(null);
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
    </View>
  );
};

export default Login;

/* ----------------------------------------------------
   STYLES
---------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  userInfoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
