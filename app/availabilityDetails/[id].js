import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import axios from "axios";
import { Database_URL } from "@env";

export default function AvailabilityDetails() {
  const { id } = useLocalSearchParams();
  const [availability, setAvailability] = useState(null);

  useEffect(() => {

    const fetchAvailability = async () => {
      try {
        const res = await axios.get(`${Database_URL}/availability/${id}`);
        setAvailability(res.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchAvailability();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      await axios.put(`${Database_URL}/availability/response/${id}`, { status });
      Alert.alert("Listo", `Disponibilidad ${status}`);
      setAvailability({ ...availability, status });
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado");
    }
  };

  if (!availability) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Consulta de Disponibilidad" }} />

      <Text style={styles.title}>Consulta #{availability.id}</Text>

      <Text style={styles.text}>Comprador: {availability.buyerId}</Text>
      <Text style={styles.text}>Servicio ID: {availability.serviceId}</Text>
      <Text style={styles.status}>Estado: {availability.status}</Text>

      {availability.status === "pending" && (
        <>
          <Pressable
            style={[styles.button, { backgroundColor: "green" }]}
            onPress={() => updateStatus("accepted")}
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={() => updateStatus("rejected")}
          >
            <Text style={styles.buttonText}>Rechazar</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  status: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    marginVertical: 15,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
