import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { View, Dimensions, Image } from "react-native";
import localImage from "../assets/AS.jpg";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { WEB_CLIENT_ID, Database_URL } from "@env";
import axios from "axios";

const { height } = Dimensions.get("window");

const Icon = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(false);


  useEffect(() => {
    GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });

    const getCurrentUser = async () => {
      const currentUser = GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUser(currentUser.user);
      }
    };

    getCurrentUser();
  }, []);


  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${Database_URL}/notifRequest`, {
          params: { googleId: user.id },
        });

        if (!response.data.title) {
          setNotifications(true);
        } else {
          setNotifications(false);
        }
      } catch (error) {
        console.log("Error al obtener notificaciones:", error);
      }
    };

    fetchNotifications();
  }, [user]); 




  return (
    <View style={Style.content}>
      <View style={Style.publicity}>
        <Image
          style={Style.image}
          source={localImage}
          alt="appointment-reminders"
        />
      </View>
      <Link href="/views/notifBell" asChild>
        <Pressable style={Style.notificationIco}>
          <Image
            style={Style.image}
            source={
              notifications
                ? require("../assets/icons8-recordatorios-de-citas-48.png")
                : require("../assets/icons8-recordatorios-de-citas-llenas-48.png")
            }
            alt="appointment-reminders"
          />
          {notifications && <View style={Style.badge} />}
        </Pressable>
      </Link>
      {user ? (
        <Link href="/views/login" asChild>
          <Pressable>
            <Image source={{ uri: user.photo }} style={Style.image} />
          </Pressable>
        </Link>
      ) : (
        <Link href="/views/login" asChild>
          <Pressable>
            <View style={Style.autentication}>
              <Image
                style={Style.image}
                source={{
                  uri: "https://img.icons8.com/material-outlined/24/user-male-circle.png",
                }}
                alt="appointment-reminders"
              />
            </View>
          </Pressable>
        </Link>
      )}
    </View>
  );
};
const Style = StyleSheet.create({
  content: {
    backgroundColor: "#ed6b3e",
    height: height / 7,
    flexDirection: "row",
    paddingVertical: height / 20,
    paddingHorizontal: height / 50,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  notificationIco: {
    flex: 1,
    marginTop: height * 0.003,
  },
  publicity: {
    flex: 4,
    marginTop: height * 0.005,
  },
  autentication: {
    flex: 0,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 25,
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: "red",
  },
});
export default Icon;
