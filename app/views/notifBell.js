import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function NotifBell() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const currentUser = GoogleSignin.getCurrentUser();
                if (!currentUser?.user?.id) return;

                const response = await axios.get(`${process.env.EXPO_PUBLIC_DATABASE_URL}/notifRequest`, {
                    params: { googleId: currentUser.user.id },
                });

                setNotifications(response.data || []);
            } catch (error) {
                console.log("Error al obtener notificaciones:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [handlePress]);

    const handlePress = async (event) => {
        try {
            const currentUser = GoogleSignin.getCurrentUser();
            if (!currentUser?.user?.id) return;

            const response = await axios.get(`${process.env.EXPO_PUBLIC_DATABASE_URL}/notifRequest`, {
                params: { googleId: currentUser.user.id },
            });

            if (response.data) {
                await axios.post(`${process.env.EXPO_PUBLIC_DATABASE_URL}/notifErase`, {
                    id: event
                })
                setNotifications((prev) => prev.filter((n) => n.id !== event));
            };

        } catch (error) {
            console.log("Error al borrar las notificaciones:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando notificaciones...</Text>
            </View>
        );
    }

    const renderedCards = notifications.map((notif, index) => (

        <View key={index} style={styles.card}>
            <Pressable style={styles.deleteButton} onPress={() => handlePress(notif.id)}>
                <Text style={styles.deleteText}>X</Text>
            </Pressable>
            <Text style={styles.title}>{notif.title}</Text>
            <Text style={styles.body}>{notif.body}</Text>
        </View>

    ));


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title1}>📬 Tus Notificaciones</Text>
            <ScrollView contentContainerStyle={styles.container}>
                {renderedCards}
            </ScrollView>
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        justifyContent: "space-between",
        backgroundColor: "#f9f9f9",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        color: "#555",
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
        marginTop: 20,
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#222",
    },
    cardBody: {
        fontSize: 15,
        color: "#555",
        marginTop: 4,
    },
    cardDate: {
        fontSize: 12,
        color: "#999",
        marginTop: 6,
        textAlign: "right",
    },
    title1: {
        marginTop: 20,
        fontSize: 30,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 30,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#fff",
        padding: 10,
        marginVertical: 8,
        borderRadius: 10,
        position: "relative", // permite posicionar el botón dentro
    },
    deleteButton: {
        position: "absolute",
        top: 30,
        left: 350,
        padding: 5,
        borderRadius: 5,
        backgroundColor: "#f44", // rojo claro
    },
    deleteText: {
        color: "white",
        fontWeight: "bold",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 25, // deja espacio para la X
    },
    body: {
        fontSize: 14,
    },
});
