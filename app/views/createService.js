import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { Stack } from "expo-router";
import { TextInput } from "react-native-paper";
import axios from "axios";

const CreateService = () => {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://10.0.2.2:3000/services", {
        name: serviceName,
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
        label="Nombre del Servicio"
        value={serviceName}
        onChangeText={(text) => setServiceName(text)}
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