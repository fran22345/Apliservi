import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Database_URL } from "@env";
import axios from "axios";

export default function ServicioActivo() {
  const { id } = useLocalSearchParams();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyer, setBuyer] = useState(null)

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const res = await axios.get(`${Database_URL}/servicioActivoBuyer/${id}`);
        const buyerRes = await axios.get(`${Database_URL}/users/${res.data.userId}`)
        setBuyer(buyerRes.data)
        setServicio(res.data);
      } catch (err) {
        setError("Error al cargar el servicio");
      } finally {
        setLoading(false);
      }
    };

    fetchServicio();
  }, [id]);

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
          <Text style={styles.label}>Servidio prestado:</Text>
          <Text style={styles.value}>{servicio.description}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{servicio.status}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{buyer.nombre +" "+buyer.apellido}</Text>
        </View>
        
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

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
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
});
