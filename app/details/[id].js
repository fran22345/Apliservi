import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Stars from "react-native-stars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import data from "../../data.json";
import { useLocalSearchParams } from "expo-router";
import {Stack} from "expo-router";

const images = {
  1: require("../../assets/pexels-moose-photos-170195-1587009.jpg"),
  2: require("../../assets/pexels-olly-712513.jpg"),
  3: require("../../assets/pexels-olly-834863.jpg"),
};

const ViewCard = () => {
  const { id } = useLocalSearchParams();
  const user = data.find((user) => user.id === parseInt(id));
  
  if (!user) {
    return <Text style={styles.error}>User not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: user.nombre +" "+ user.apellido }} />
      <Image source={images[user.linkFoto]} style={styles.image} />
      <Text style={styles.name}>
        {user.nombre} {user.apellido}
      </Text>
      <View style={styles.profesion}>
        <Text style={styles.profesionText}>{user.profesion}</Text>
      </View>
      <Stars
        style={styles.stars}
        display={user.puntuacion}
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
});

export default ViewCard;
