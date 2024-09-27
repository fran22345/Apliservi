import React from "react";
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
import { useEffect, useState } from "react";
import { WEB_CLIENT_ID } from "@env";

export default function SignIn() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
  });

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const response = await GoogleSignin.signIn();
      console.log(response);

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(
        response.data?.idToken
      );

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the sign-in flow
            break;
          case statusCodes.IN_PROGRESS:
            // operation (e.g. sign in) is in progress already
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
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
    <View style={styles.container}>
      <Text style={styles.text}>Welcome {user.email}</Text>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => auth().signOut()}
      >
        <Text>Cerrar Secion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
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
