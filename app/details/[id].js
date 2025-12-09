import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Alert } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import axios from "axios";
import { openBrowserAsync } from "expo-web-browser";
import { WEB_CLIENT_ID, Database_URL } from "@env";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Rating } from "react-native-ratings";
import { ScrollView } from "react-native";

const ViewCard = () => {
  const { id } = useLocalSearchParams();

  const [service, setService] = useState(null);
  const [userDB, setUserDB] = useState(null);

  const [availabilityId, setAvailabilityId] = useState(null);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null); // null, true, false


  // ------------------------------
  // 1. LOAD SERVICE
  // ------------------------------
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${Database_URL}/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchService();
  }, [id]);


  // ------------------------------
  // 2. LOAD USER FROM DB
  // ------------------------------
  useEffect(() => {
    GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });

    const getCurrentUser = async () => {
      try {
        const currentUser = GoogleSignin.getCurrentUser();
        if (!currentUser) return;

        const googleUser = currentUser.user;

        const response = await axios.get(
          `${Database_URL}/users/${googleUser.id}`
        );

        setUserDB(response.data);
      } catch (err) {
        console.log("Error cargando usuario:", err);
      }
    };

    getCurrentUser();
  }, []);


  // ------------------------------
  // 3. POLLING CHECK AVAILABILITY
  // ------------------------------
  useEffect(() => {
    if (!userDB || !service) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${Database_URL}/availability/check`,
          {
            params: {
              buyerId: userDB.id,
              providerId: service.User.id,
              serviceId: service.id,
            },
          }
        );

        if (!res.data || !res.data.status) {
          console.log("Sin disponibilidad aún");
          return;
        }

        if (res.data.status === "accepted") {
          setAvailable(true);
          setChecking(false);
        }

        if (res.data.status === "rejected") {
          setAvailable(false);
          setChecking(false);
        }
      } catch (err) {
        console.log("Error checking availability:", err);
      }

    }, 4000);

    return () => clearInterval(interval);
  }, [userDB, service]);



  // ------------------------------
  // 4. REQUEST AVAILABILITY
  // ------------------------------
  const checkAvailability = async () => {
    if (!userDB || !service) return;

    try {
      const res = await axios.post(`${Database_URL}/availability/request`, {
        providerId: service.User.id,
        buyerId: userDB.id,
        serviceId: service.id
      });

      setAvailabilityId(res.data.id);
      setChecking(true);
      setAvailable(null);   // vuelve a estado desconocido
    } catch (err) {
      console.log("Error request availability:", err);
    }
  };


  // ------------------------------
  // 5. HANDLE PREFERENCIA MP
  // ------------------------------
  const handlePreferencias = async () => {
    try {
      const requestData = {
        idBuyer: userDB.id,
        userId: service.User.id,
        description: service.description,
        quantity: 1,
        unit_price: service.price,
      };

      const response = await axios.post(
        `${Database_URL}/crear-preferencia`,
        requestData
      );

      const { sandbox_init_point } = response.data.response;
      await openBrowserAsync(sandbox_init_point);

    } catch (error) {
      Alert.alert("Error", "No se pudo crear la preferencia de pago.");
      console.error(error);
    }
  };


  if (!service) return <Text>Cargando...</Text>;


  // ------------------------------
  // UI
  // ------------------------------
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Stack.Screen
          options={{ title: `${service.User.nombre} ${service.User.apellido}` }}
        />

        <Image source={{ uri: service.User.linkFoto }} style={styles.image} />

        <Text style={styles.name}>
          {service.User.nombre} {service.User.apellido}
        </Text>

        <Text style={styles.profesionText}>{service.User.profesion}</Text>
        <Text style={styles.price}>Servicio: ${service.price}</Text>

        <Rating
          readonly
          startingValue={
            service.User.scoresReceived?.length > 0
              ? service.User.scoresReceived.reduce((a, s) => a + s.value, 0) /
              service.User.scoresReceived.length
              : 0
          }
          imageSize={28}
          style={{ marginVertical: 8 }}
        />

        <Pressable
          style={[
            styles.verifyButton,
            {
              opacity:
                checking || available === true || available === false
                  ? 0.4
                  : 1,
            },
          ]}
          disabled={checking || available === true || available === false}
          onPress={checkAvailability}
        >
          <Text style={styles.buttonText}>
            {checking
              ? "Verificando..."
              : available === true
                ? "Aceptado"
                : available === false
                  ? "No disponible"
                  : "Verificar disponibilidad"}
          </Text>
        </Pressable>


        <Pressable
          style={[
            styles.payButton,
            { opacity: available === true ? 1 : 0.4 }
          ]}
          disabled={available !== true}
          onPress={handlePreferencias}
        >
          <Text style={styles.buttonText}>
            {available === true
              ? "Pagar con Mercado Pago"
              : "Esperando confirmación..."}
          </Text>
        </Pressable>

        {available === false && (
          <Text style={{ color: "red", marginTop: 10 }}>
            El proveedor no está disponible.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ViewCard;


// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  image: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "bold" },
  profesionText: { fontSize: 22, marginVertical: 4, fontWeight: "600" },
  price: { fontSize: 18, marginBottom: 10 },
  verifyButton: {
    backgroundColor: "green",
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  payButton: {
    backgroundColor: "#007BFF",
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});
