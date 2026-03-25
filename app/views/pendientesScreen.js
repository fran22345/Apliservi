import { Link } from "expo-router";
import {
  Text,
  FlatList,
  View,
  StyleSheet,
} from "react-native";

export default function PendientesScreen({ data = [], user }) {

  if (!data.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tenés servicios pendientes</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => `serv-${item.id}`}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/servUserDetails/[id]",
            params: {
              id: item.id,
              userId: user.id,
            },
          }}
          style={styles.card}
        >
          <Text style={styles.title}>{item.description}</Text>
          <Text style={styles.status}>Estado: {item.status}</Text>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  status: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
  },
});