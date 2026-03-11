import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function useNotificationNavigation() {
  const router = useRouter();

  useEffect(() => {
    const sub =
      Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;

        if (!data) return;

        if (data.type === 'service') {
          router.push(`/services/${data.id}`);
        }

        if (data.type === 'prestacion') {
          router.push(`/prestaciones/${data.id}`);
        }
      });

    return () => sub.remove();
  }, []);
}
