import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { WEB_CLIENT_ID, Database_url } from "@env";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const Login = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });

    const getCurrentUser = async () => {
      const currentUser = GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUserInfo(currentUser);
      }
    };

    const registerForPushNotifications = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          Alert.alert(
            "Error",
            "No se pudo obtener permisos para notificaciones."
          );
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);

        await savePushTokenToDatabase(token);
      } else {
        Alert.alert(
          "Error",
          "Las notificaciones push solo funcionan en dispositivos físicos."
        );
      }
    };

    getCurrentUser();
    registerForPushNotifications();
  }, []);

  const savePushTokenToDatabase = async (token) => {
    try {
      const response = await fetch(Database_url+"/save-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        throw new Error("Error al guardar el token en la base de datos.");
      }
    } catch (error) {
      console.error("Error al guardar el token:", error);
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo.data);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  if (userInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>{userInfo.user.name}</Text>
          <Text style={styles.userInfoText}>{userInfo.user.email}</Text>
          <Image
            style={styles.userInfoImage}
            source={{ uri: userInfo.user.photo }}
          />
          <Button
            title="Cerrar sesión"
            onPress={async () => {
              await GoogleSignin.revokeAccess();
              await GoogleSignin.signOut();
              setUserInfo(null);
            }}
          ></Button>
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

export default Login;
