import axios from "axios";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Database_URL } from "@env";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Link } from "expo-router";

export default function ServiciosActivos() {
  const [servicios, setServicios] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = GoogleSignin.getCurrentUser();
        if (!currentUser?.user?.id) return;

        // Traer usuario desde DB
        const userRes = await axios.get(
          `${Database_URL}/users/${currentUser.user.id}`
        );
        setUser(userRes.data);

        // Traer servicios activos
        const servRes = await axios.get(`${Database_URL}/serviciosActivos`, {
          params: { userId: userRes.data.id },
        });
        setServicios(servRes.data || []);

        // Traer pedidos de disponibilidad
        const availRes = await axios.get(`${Database_URL}/availability`, {
          params: { userId: userRes.data.id },
        });

        // -----------------------
        // ELIMINAR DUPLICADOS
        // -----------------------
        const uniqueAvailability = [];
        const seen = new Set();

        availRes.data.forEach((a) => {
          const key = `${a.buyerId}-${a.serviceId}-${a.status}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueAvailability.push(a);
          }
        });

        setAvailability(uniqueAvailability);
      } catch (error) {
        console.log("Error al obtener servicios o availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ----------------------------------------
  // Loading screen
  // ----------------------------------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>No se pudo cargar el usuario.</Text>
      </View>
    );
  }

  // ----------------------------------------
  // Render servicios activos
  // ----------------------------------------
  const renderedServicios = servicios.map((serv) => (
    <Link
      key={`serv-${serv.id}`}
      style={styles.card}
      href={{
        pathname: "/servUserDetails/[id]",
        params: {
          id: serv.id,
          userId: user.id,
        },
      }}
    >
      <Text style={styles.title}>{serv.description}</Text>
      <Text style={styles.body}>Estado: {serv.status}</Text>
    </Link>
  ));

  // ----------------------------------------
  // Render availability filtrado
  // ----------------------------------------
  const renderedAvailability = availability.map((a) => (
    <Link
      key={`avail-${a.id}`}
      style={styles.card}
      href={{
        pathname: "/availabilityDetails/[id]",
        params: {
          id: a.id,
          userId: user.id,
          buyerId: a.buyerId,
          status: a.status,
        },
      }}
    >
      <Text style={styles.title}>Consulta de disponibilidad</Text>
      <Text style={styles.body}>Solicitado por: {a.buyerId}</Text>
      <Text style={styles.body}>Estado: {a.status}</Text>
    </Link>
  ));

  // ----------------------------------------
  // Render principal
  // ----------------------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Servicios activos */}
      <Text style={styles.title1}>Servicios prestados</Text>
      {renderedServicios.length ? (
        renderedServicios
      ) : (
        <Text style={styles.emptyText}>No tenés servicios activos.</Text>
      )}

      {/* Pedidos de disponibilidad */}
      <Text style={styles.title1}>Pedidos de disponibilidad</Text>
      {renderedAvailability.length ? (
        renderedAvailability
      ) : (
        <Text style={styles.emptyText}>No tenés pedidos de disponibilidad.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
  },
  title1: {
    marginTop: 25,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  body: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginBottom: 20,
  },
});
