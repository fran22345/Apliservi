import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Stars from "react-native-stars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router";
import axios from "axios";
import { openBrowserAsync } from "expo-web-browser";
import { WEB_CLIENT_ID } from "@env";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const ViewCard = () => {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [userInfoId, setUserInfoId] = useState(null);

  useEffect(() => {
    axios
      .get("http://10.0.2.2:3000/users/" + id)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        setError("User not found");
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });

    const getCurrentUser = async () => {
      const currentUser = GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUserInfoId(currentUser.user.id);
      }
    };

    getCurrentUser();
  }, []);

  const handlePreferencias = async () => {
    try {
      const requestData = {
        idBuyer: userInfoId,
        userId: id,
        title: "mi producto",
        quantity: 1,
        unit_price: 1,
      };
  
      const response = await axios.post("http://10.0.2.2:3000/crear-preferencia", requestData);
  
      const { sandbox_init_point } = response.data.response;
  
      await openBrowserAsync(sandbox_init_point);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la preferencia de pago.");
      console.error(error);
    }
  };

  if (!user) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: user.nombre + " " + user.apellido }} />
      <Image source={{ uri: user.linkFoto }} style={styles.image} />
      <Text style={styles.name}>
        {user.nombre} {user.apellido}
      </Text>
      <View style={styles.profesion}>
        <Text style={styles.profesionText}>{user.profesion}</Text>
      </View>
      <Text style={styles.name}>Servicio: ${user.price}</Text>
      <Stars
        style={styles.stars}
        display={user.score}
        count={5}
        half={false}
        starSize={50}
        fullStar={
          <Icon name="star" style={[styles.myStarStyle, { fontSize: 50 }]} />
        }
        emptyStar={
          <Icon
            name="star-outline"
            style={[
              styles.myStarStyle,
              styles.myEmptyStarStyle,
              { fontSize: 50 },
            ]}
          />
        }
        halfStar={
          <Icon
            name="star-half"
            style={[styles.myStarStyle, { fontSize: 50 }]}
          />
        }
      />
      <View style={styles.messagesContainer}>
        {user.messages.map((msg) => (
          <Text key={msg.id} style={styles.message}>
            {msg.message}
          </Text>
        ))}
      </View>
      <Pressable style={styles.pressable} onPress={handlePreferencias}>
        <Text style={styles.buttonText}>Pago Mp</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  myStarStyle: {
    color: "yellow",
    backgroundColor: "transparent",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: "white",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 1,
  },
  myStarStyle: {
    color: "#ffd700",
    backgroundColor: "transparent",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: "gray",
  },
  profesion: {
    marginTop: 10,
    marginBottom: 10,
  },
  profesionText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  messagesContainer: {
    alignItems: "center",
  },
  message: {
    fontSize: 20,
    marginBottom: 5,
  },
  error: {
    fontSize: 20,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  pressable: {
    backgroundColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: "100%",
    borderRadius: 3,
    borderColor: "#e0e0e0",
    borderWidth: 0.3,
    marginTop: 30,
  },
});

export default ViewCard;
