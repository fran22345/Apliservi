import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Database_URL } from "@env";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Link } from "expo-router";

export default function serviciosActivos() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([])

  useEffect(() => {
    const fetchServActiv = async () => {
      try {
        const currentUser = GoogleSignin.getCurrentUser();
        if (!currentUser?.user?.id) return;
        const user = await axios.get(`${Database_URL}/users/${currentUser.user.id}`);
        if (user) setUser(user.data);
        const response = await axios.get(`${Database_URL}/serviciosActivos`, {
          params: { userId: user.data.id }
        });

        setServicios(response.data || []);
      } catch (error) {
        console.log("Error al obtener servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServActiv();
  }, []);


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando servicios...</Text>
      </View>
    );
  }

  
  const renderedCards = servicios.map((serv, index) => (

    <Link key={index} style={styles.card} href={{
      pathname: '/servUserDetails/[id]',
      params: { 
        id: user.id,
       }
    }}>
      <Text style={styles.title}>{serv.description+" "}</Text>
      <Text style={styles.body}>Estado: {serv.status}</Text>
    </Link>

  ));



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title1}>Servicios prestados</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {renderedCards}
      </ScrollView>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "space-between",
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
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  cardBody: {
    fontSize: 15,
    color: "#555",
    marginTop: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    textAlign: "right",
  },
  title1: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    position: "relative", // permite posicionar el botón dentro
  },
  deleteButton: {
    position: "absolute",
    top: 30,
    left: 350,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#f44", // rojo claro
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 25, // deja espacio para la X
  },
  body: {
    fontSize: 14,
  },
});
