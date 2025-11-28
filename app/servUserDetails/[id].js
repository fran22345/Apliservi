import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Pressable, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Database_URL } from "@env";
import axios from "axios";

export default function ServicioActivo() {
  const { id } = useLocalSearchParams();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyer, setBuyer] = useState(null);

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const res = await axios.get(`${Database_URL}/servicioActivoUser/${id}`);
        const buyerRes = await axios.get(`${Database_URL}/users/${res.data.idBuyer}`);
        
        setBuyer(buyerRes.data);
        setServicio(res.data);
      } catch (err) {
        setError("Error al cargar el servicio");
      } finally {
        setLoading(false);
      }
    };

    fetchServicio();
  }, [id]);

  const handleConcluir = () => {
    Alert.alert(
      "Confirmar",
      "¿Deseas marcar este servicio como concluido y notificar al cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, concluir",
          onPress: async () => {
            try {
              await axios.post(`${Database_URL}/servicioConcluido`, {
                servId: servicio.id,
                buyerId: servicio.idBuyer
              });

              Alert.alert(
                "Servicio concluido",
                "El cliente ha sido notificado.",
                [{ text: "OK", onPress: () => router.replace("/") }]
              );

            } catch (err) {
              Alert.alert("Error", "No se pudo notificar al cliente.");
              console.log(err);
            }
          },
        }
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

  if (!servicio)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No se encontró el servicio</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <View style={styles.row}>
          <Text style={styles.label}>Servicio prestado:</Text>
          <Text style={styles.value}>{servicio.description}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{servicio.status}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{buyer.nombre + " " + buyer.apellido}</Text>
        </View>

        {/* BOTÓN PARA CONCLUIR */}
        <Pressable style={styles.doneButton} onPress={handleConcluir}>
          <Text style={styles.doneText}>Concluir Servicio</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  row: {
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  error: {
    fontSize: 16,
    color: "red",
    fontWeight: "600",
  },

  // 🔥 Botón concluir
  doneButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  doneText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
