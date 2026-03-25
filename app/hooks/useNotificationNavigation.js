import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

export default function useNotificationNavigation() {
  const lastNotificationResponse =
    Notifications.useLastNotificationResponse();

  useEffect(() => {

    //  App abierta / background
    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        console.log("TOUCH NOTIFICATION:", data);

        if (data?.route) {
          setTimeout(() => {
            router.replace(data.route);
          }, 100);
        }
      });

    return () => subscription.remove();
  }, []);

  //  App abierta desde notificación (ANTES cerrada)
  useEffect(() => {
    if (lastNotificationResponse) {
      const data =
        lastNotificationResponse.notification.request.content.data;

      console.log("APP OPEN FROM NOTIFICATION:", data);

      if (data?.route) {
        setTimeout(() => {
          router.replace(data.route);
        }, 100);
      }
    }
  }, [lastNotificationResponse]);
}