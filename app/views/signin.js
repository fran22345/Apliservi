import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Icon from "react-native-vector-icons/FontAwesome";
import auth from "@react-native-firebase/auth";
import { WEB_CLIENT_ID } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../../redux/userSlice";
import { useRouter, Stack } from "expo-router";

export default function SignIn() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [canIn, setCanIn] = useState(false);

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
  });

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {}, [user]);

  function onAuthStateChanged(user) {
    if (user) {
      const { displayName, email, photoURL } = user;
      dispatch(setUser({ displayName, email, photoURL }));

      if (canIn) {
        router.back();
        setCanIn(false);
      }
    } else {
      dispatch(clearUser());
      setCanIn(true);
    }
  }

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.data.idToken
      );

      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log("User cancelled the sign-in process");
            break;
          case statusCodes.IN_PROGRESS:
            console.log("Sign-in is in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Play services not available or outdated");
            break;
          default:
            console.log("Some other error happened", error);
        }
      } else {
        console.log(
          "An error occurred that is not related to Google Sign-In",
          error
        );
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      dispatch(clearUser());
      router.back();
    } catch (error) {
      console.log("Error signing out", error);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Inicar Secion" }} />
        <TouchableOpacity style={styles.signInButton} onPress={signIn}>
          <Icon
            name="google"
            size={20}
            color="#fff"
            style={styles.googleIcon}
          />
          <Text style={styles.signInButtonText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: user.displayName }} />
      <View style={styles.centeredView}>
        <Text style={styles.text}>Hola {user.displayName}!</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.text}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  signInButton: {
    flexDirection: "row",
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  googleIcon: {
    marginRight: 10,
  },
  signInButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
});
