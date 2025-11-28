import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Alert, Text } from "react-native";
import { Stack } from "expo-router";
import { TextInput } from "react-native-paper";
import axios from "axios";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Database_URL } from "@env";

const CreateService = () => {
  const [serviceProfession, setServiceProfession] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [state, setState] = useState({ currentUser: null });
  const [userState, setUserState] = useState("");

  const getCurrentUser = async () => {
    const currentUser = GoogleSignin.getCurrentUser();
    setState({ currentUser });

  };

  const dbUser = async () => {
    const user = await axios.get(Database_URL + "/users/" + state.currentUser.user.id);
    setUserState(user.data.id)

  };

  useEffect(() => {
    const fetchUser = async () => {
      await getCurrentUser();
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (state.currentUser) {
      dbUser();
    }
  }, [state.currentUser]);




  const handleSubmit = async () => {
    try {
      await axios.post(Database_URL + "/services", {
        nombre: state.currentUser.user.givenName,
        apellido: state.currentUser.user.familyName,
        profesion: serviceProfession,
        linkFoto: state.currentUser.user.photo,
        description: serviceDescription,
        price: parseFloat(servicePrice),
        googleId: state.currentUser.user.id,
        userId: userState,
      });
      Alert.alert("Éxito", "Servicio creado exitosamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el servicio");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Servicio</Text>
      <Stack.Screen options={{ title: "Crear Servicio" }} />
      <TextInput
        label="Profesión"
        value={serviceProfession}
        onChangeText={(text) => setServiceProfession(text)}
        style={styles.input}
      />
      <TextInput
        label="Descripción del Servicio"
        value={serviceDescription}
        onChangeText={(text) => setServiceDescription(text)}
        style={styles.input}
      />
      <TextInput
        label="Precio del Servicio"
        value={servicePrice}
        onChangeText={(text) => setServicePrice(text)}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Crear Servicio" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
});

export default CreateService;
