import { Link } from "expo-router";
import {
  Text,
  FlatList,
  View,
  StyleSheet,
} from "react-native";

export default function AvailabilityScreen({ data, user }) {
  if (!data.length) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No hay solicitudes de disponibilidad</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => `avail-${item.id}`}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/availabilityDetails/[id]",
            params: {
              id: item.id,
              userId: user.id,
              buyerId: item.idBuyer,
              status: item.status,
            },
          }}
          style={styles.card}
        >
          <Text style={styles.text}>
            Consulta de disponibilidad
          </Text>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
  },
});