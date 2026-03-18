import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Button, Platform, TextInput, ActivityIndicator } from "react-native";
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
import { Rating } from "react-native-ratings";

/* ----------------------------------------------------
PUSH NOTIFICATIONS
---------------------------------------------------- */
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

/* ----------------------------------------------------
LOGIN
---------------------------------------------------- */
const Login = () => {
  const [authUser, setAuthUser] = useState(null); // Google
  const [dbUser, setDbUser] = useState(null);     // Backend
  const [score, setScore] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
  });

  /* ---------------- GET USER DB ---------------- */
  const getDbUser = async (googleId) => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/users/${googleId}`
      );
      setDbUser(res.data);

      // cargar form con datos reales
      setForm({
        nombre: res.data.nombre,
        apellido: res.data.apellido,
        email: res.data.email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- SCORE ---------------- */
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

  /* ---------------- CHECK SESSION ---------------- */
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

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- UPDATE USER ---------------- */
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

      // refrescar datos reales
      await getDbUser(authUser.id);

      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- LOGIN ---------------- */
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
            style={{ marginVertical: 8 }}
          />

          <Image source={{ uri: dbUser.linkFoto }} style={styles.userInfoImage} />

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

              <Button title="Guardar" onPress={handleUserUpdate} />
              <Button title="Cancelar" onPress={() => setEditMode(false)} />
            </>
          ) : (
            <>
              <Text style={styles.userInfoText}>{dbUser.nombre}{" "}{dbUser.apellido}</Text>
              <Text style={styles.userInfoText}>{dbUser.email}</Text>

              <Button title="Editar" onPress={() => setEditMode(true)} />
            </>
          )}

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

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  userInfoContainer: {
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  userInfoText: { fontSize: 18, marginBottom: 10 },
  userInfoImage: { width: 100, height: 100, borderRadius: 50 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 5,
    width: 200,
    borderRadius: 5,
  },
});