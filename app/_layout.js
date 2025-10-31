import { useEffect, useState } from "react";
import { Slot, Stack, router } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Layout() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        setUser(currentUser);
        if (!currentUser) {
          router.replace("/views/login"); // redirige si no hay sesión
        }
      } catch (error) {
        console.error("Error al chequear sesión:", error);
        router.replace("/views/login");
      }
    };

    checkUser();
  }, []);

  // Mientras verificamos → renderizamos Stack vacío para evitar errores
  if (checking) return <Stack screenOptions={{ headerShown: false }} />;

  // Si hay usuario → renderizamos las pantallas hijas
  return user ? <Slot /> : null;
}
