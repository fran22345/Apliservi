import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { View, Dimensions, Image } from "react-native";
import localImage from "../assets/AS.jpg";
import { Link } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { WEB_CLIENT_ID } from "@env";
import { useSelector } from "react-redux";


const { height } = Dimensions.get("window");
GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });

const Icon = () => {
  const user = useSelector((state) => state.user.user);

  

  



  return (
    <View style={Style.content}>
      <View style={Style.publicity}>
        <Image
          style={Style.image}
          source={localImage}
          alt="appointment-reminders"
        />
      </View>
      <View style={Style.notificationIco}>
        <Image
          style={Style.image}
          source={{
            uri: "https://img.icons8.com/fluency-systems-regular/50/appointment-reminders--v1.png",
          }}
          alt="appointment-reminders"
        />
      </View>
      {user ? (
        <Link href="/views/signin" asChild>
          <Pressable>
            <Image source={{uri: user.photoURL}} style={Style.image} />
          </Pressable>
        </Link>
      ) : (
        <Link href="/views/signin" asChild>
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
});
export default Icon;
