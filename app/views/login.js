import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Button, Platform } from "react-native";
import { WEB_CLIENT_ID, Database_URL } from "@env";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";
import Constants from "expo-constants"
import { router } from "expo-router";

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  //if (Device.isDevice) { habilitar esto en produccion
  if (true) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      console.log('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);

      return pushTokenString;
    } catch (e) {
      console.log(`${e}`);
    }
  } else {
    console.log('Must use physical device for push notifications');
  }
}



const Login = () => {
  const [userInfo, setUserInfo] = useState(null);

  const getCurrentUser = async () => {
    const currentUser = GoogleSignin.getCurrentUser();
    if (currentUser) {
      setUserInfo(currentUser);

    }
  };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });
    getCurrentUser();
  }, []);


  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo.data);
      const expoPushToken = await registerForPushNotificationsAsync();
      await axios.post(Database_URL + "/users", {
        googleId: userInfo.data.user.id,
        nombre: userInfo.data.user.givenName,
        apellido: userInfo.data.user.familyName,
        linkFoto: userInfo.data.user.photo,
        expoPushToken: expoPushToken,
        email: userInfo.data.user.email
      });
      router.replace("/views/homeScreen");

    } catch (error) {
      console.log("Error en signIn:", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Usuario canceló login");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign-in en progreso");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play Services no disponible");
      } else {
        console.log("Otro error:", error);
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
