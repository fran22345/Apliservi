import { View, Button } from 'react-native';
import useNotification from '../../hooks/useNotification';



async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}


export default function App() {
  const expoNotification = useNotification()
  
  console.log(expoNotification);
  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoNotification);
        }}
      />
    </View>
  );
}
