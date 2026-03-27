import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import { Rating } from "react-native-ratings";

/* ---------------- PUSH ---------------- */
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  if (!Device.isDevice) return null;

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch {
    return null;
  }
}

const Login = () => {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [score, setScore] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
  });

  const getDbUser = async (googleId) => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/users/${googleId}`
      );
      setDbUser(res.data);
      setForm({
        nombre: res.data.nombre,
        apellido: res.data.apellido,
        email: res.data.email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getScore = async (googleId) => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/scores/${googleId}`
      );
      setScore(res.data.value || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const checkUser = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      const googleUser = userInfo.data.user;

      setAuthUser(googleUser);

      await getDbUser(googleUser.id);
      await getScore(googleUser.id);
    } catch {
      console.log("No hay sesión activa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });

    checkUser();
  }, []);

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserUpdate = async () => {
    try {
      await axios.patch(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/users`,
        {
          googleId: authUser.id,
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
        }
      );

      await getDbUser(authUser.id);
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const result = await GoogleSignin.signIn();
      const googleUser = result.data.user;

      setAuthUser(googleUser);

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

      await getDbUser(googleUser.id);
      await getScore(googleUser.id);

      router.replace("/views/homeScreen");
    } catch (error) {
      console.log("Error en login:", error);
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (dbUser) {
    return (
      <View style={styles.container}>
        <View style={styles.userInfoContainer}>
          <Rating
            readonly
            startingValue={score}
            imageSize={28}
            style={{ marginVertical: 10 }}
          />

          <Image
            source={{ uri: dbUser.linkFoto }}
            style={styles.userInfoImage}
          />

          {editMode ? (
            <>
              <TextInput
                value={form.nombre}
                onChangeText={(t) => handleChange("nombre", t)}
                style={styles.input}
                placeholder="Nombre"
              />
              <TextInput
                value={form.apellido}
                onChangeText={(t) => handleChange("apellido", t)}
                style={styles.input}
                placeholder="Apellido"
              />
              <TextInput
                value={form.email}
                onChangeText={(t) => handleChange("email", t)}
                style={styles.input}
                placeholder="Email"
              />

              <View style={styles.buttonContainer}>
                <Button title="Guardar" onPress={handleUserUpdate} />
                <Button title="Cancelar" onPress={() => setEditMode(false)} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.userName}>
                {dbUser.nombre} {dbUser.apellido}
              </Text>

              <Text style={styles.userInfoText}>{dbUser.email}</Text>

              <View style={styles.buttonContainer}>
                <Button title="Editar" onPress={() => setEditMode(true)} />
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Cerrar sesión"
              onPress={async () => {
                await GoogleSignin.signOut();
                setAuthUser(null);
                setDbUser(null);
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <GoogleSigninButton
          style={{ width: 220, height: 50 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      </View>
    </View>
  );
};

export default Login;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  userInfoContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  userInfoImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },

  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },

  userInfoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },

  input: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
  },

  buttonContainer: {
    width: "100%",
    marginTop: 10,
    gap: 8,
  },

  loginContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});