import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Pressable, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import { Rating } from "react-native-ratings";

export default function ServicioActivo() {
  const { id } = useLocalSearchParams();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [worker, setWorker] = useState(null);
  const [buyer, setBuyer] = useState(null); // <- usuario LOGUEADO (UUID real)
  const [value, setValue] = useState(0);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [existingScore, setExistingScore] = useState(null);

  // Obtiene usuario desde tu DB usando el googleId
  const getLoggedUser = async () => {
    const google = GoogleSignin.getCurrentUser();
    if (!google?.user?.id) return null;

    const res = await axios.get(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/${google.user.id}`);
    return res.data; // este es el que tiene el UUID real
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. usuario logueado real (UUID)
        const buyerData = await getLoggedUser();
        setBuyer(buyerData);

        // 2. Obtener servicio activo
        const res = await axios.get(`${process.env.EXPO_PUBLIC_DATABASE_URL}/servicioActivoBuyer/${id}`);
        setServicio(res.data);

        // 3. Datos del profesional
        const workerRes = await axios.get(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/id/${res.data.userId}`);
        setWorker(workerRes.data);
        
        // 4. Verificar si el comprador YA calificó este servicio
        const scoreRes = await axios.get(`${process.env.EXPO_PUBLIC_DATABASE_URL}/score/check`, {
          params: {
            buyerId: buyerData.id,
            payId: res.data.id
          }
        });


        if (scoreRes.data?.value) {
          setExistingScore(scoreRes.data.value);
          setAlreadyRated(true);
        }
      } catch (err) {
        console.log(err);
        setError("Error al cargar el servicio");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);


  const handleSendRating = () => {
    Alert.alert(
      "Confirmar Calificación",
      "¿Deseas enviar esta calificación? No podrás cambiarla luego.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, enviar",
          onPress: async () => {
            try {
              await axios.post(`${process.env.EXPO_PUBLIC_DATABASE_URL}/scores`, {
                userId: worker.id,      // profesional
                buyerId: buyer.id,      // comprador (UUID REAL)
                payId: servicio.id, // servicio finalizado
                value,
              });

              setAlreadyRated(true);
              setExistingScore(value);

              Alert.alert("Listo!", "Calificaste al prestador.");
            } catch (err) {
              console.log(err);
              Alert.alert("Error", "No se pudo guardar la calificación.");
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Servicio:</Text>
          <Text style={styles.value}>{servicio.description}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{servicio.status}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Prestador:</Text>
          <Text style={styles.value}>{worker?.nombre} {worker?.apellido}</Text>
        </View>

        {servicio.status === "finalized" && (
          <View style={styles.ratingBox}>
            {!alreadyRated ? (
              <Rating startingValue={value} onFinishRating={setValue} imageSize={35} />
            ) : (
              <Rating startingValue={existingScore} readonly imageSize={35} />
            )}

            <Pressable
              style={[
                styles.rateButton,
                { opacity: value === 0 || alreadyRated ? 0.4 : 1 },
              ]}
              disabled={value === 0 || alreadyRated}
              onPress={handleSendRating}
            >
              <Text style={styles.rateText}>
                {alreadyRated ? "Calificación enviada" : "Enviar Calificación"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f7f7f7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  row: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "500" },
  value: { fontSize: 16, fontWeight: "600" },
  error: { fontSize: 16, color: "red" },
  ratingBox: { marginTop: 25, alignItems: "center" },
  rateButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  rateText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
