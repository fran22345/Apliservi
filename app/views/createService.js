import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { Stack } from "expo-router";
import { TextInput } from "react-native-paper";
import axios from "axios";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Database_url } from "@env";

const CreateService = () => {
  const [serviceProfession, setServiceProfession] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [state, setState] = useState({ currentUser: null });

  const getCurrentUser = async () => {
    try {
      await GoogleSignin.configure();
      const currentUser = await GoogleSignin.getCurrentUser();

      setState({ currentUser });
    } catch (error) {
      console.error("Error getting current user", error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(Database_url+"/users", {
        nombre: state.currentUser.user.givenName,
        apellido: state.currentUser.user.familyName,
        profesion: serviceProfession,
        linkFoto: state.currentUser.user.photo,
        description: serviceDescription,
        price: parseFloat(servicePrice),
      });
      Alert.alert("Éxito", "Servicio creado exitosamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el servicio");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
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
});

export default CreateService;
