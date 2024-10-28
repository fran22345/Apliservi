import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import data from "../data.json";

const Card = () => {
  const [dataState, setDataState] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDataState(data);
    }, 3000);

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <>
      {dataState.length > 0 ? (
        dataState.map((item, index) => (
          <Link key={index} href={{
            pathname: '/details/[id]',
            params: { id: item.id },
          }} asChild>
            <Pressable style={styles.item}>
              <Text style={styles.text}>{item.nombre +": "+item.profesion}</Text>
              <Text style={styles.puntuacion}>{item.puntuacion}</Text>
            </Pressable>
          </Link>
        ))
      ) : (
        <Text style={styles.text}>Cargando...</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    marginTop: 5,
    marginRight: 10,
    marginBottom: 5,
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  
  },
  puntuacion: {

    fontSize: 20,
    color: "gray", 
    textAlign: "right"
  },
});

export default Card;
