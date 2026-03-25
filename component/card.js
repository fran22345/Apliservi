import { useEffect, useState, useMemo } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Link } from "expo-router";
import axios from "axios";

export default function Card() {
  const [dataState, setDataState] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_DATABASE_URL}/services/`
        );
        
        //  Convertir puntuacion a número
        const normalized = res.data.map((item) => ({
          ...item,
          puntuacion: item.puntuacion
            ? parseFloat(item.puntuacion)
            : null,
        }));

        setDataState(normalized);
      } catch (error) {
        console.error("Error trayendo servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  //  FILTRO
  const filteredData = useMemo(() => {
    return dataState.filter((item) =>
      `${item.nombre} ${item.profesion}`
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, dataState]);

  const renderItem = ({ item }) => (
    <Link
      href={{
        pathname: "/details/[id]",
        params: { id: item.id.toString() },
      }}
      asChild
    >
      <Pressable style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.text}>
            {item.nombre} - {item.profesion}
          </Text>

          <Text style={styles.sub}>
            {item.puntuacion
              ? `⭐ ${item.puntuacion.toFixed(1)}`
              : "Sin reviews"}
          </Text>
        </View>
      </Pressable>
    </Link>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Cargando servicios...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
   
      <TextInput
        placeholder="Buscar servicios..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      {filteredData.length === 0 ? (
        <Text style={styles.empty}>No hay resultados</Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  item: {
    marginBottom: 10,
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  sub: {
    marginTop: 5,
    fontSize: 14,
    color: "#777",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
    fontSize: 16,
  },
});