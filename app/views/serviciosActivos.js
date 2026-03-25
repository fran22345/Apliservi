import axios from "axios";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AvailabilityScreen from "../views/availableScreen"
import PendientesScreen from "../views/pendientesScreen"

const Tab = createMaterialTopTabNavigator();

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

        const userRes = await axios.get(
          `${process.env.EXPO_PUBLIC_DATABASE_URL}/users/${currentUser.user.id}`
        );
        setUser(userRes.data);

        const servRes = await axios.get(
          `${process.env.EXPO_PUBLIC_DATABASE_URL}/serviciosActivos`,
          { params: { userId: userRes.data.id } }
        );
        setServicios(servRes.data || []);

        const availRes = await axios.get(
          `${process.env.EXPO_PUBLIC_DATABASE_URL}/availability`,
          { params: { userId: userRes.data.id } }
        );
        
        const uniqueAvailability = [];
        const seen = new Set();

        availRes.data.forEach((a) => {
          const key = a.id;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueAvailability.push(a);
          }
        });

        setAvailability(uniqueAvailability);

      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View>
        <Text>No se pudo cargar el usuario</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="Pendientes">
        {() => <PendientesScreen data={servicios} user={user} />}
      </Tab.Screen>

      <Tab.Screen name="Solicitudes">
        {() => <AvailabilityScreen data={availability} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}