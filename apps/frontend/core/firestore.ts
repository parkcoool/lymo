import { connectFirestoreEmulator, getFirestore } from "@react-native-firebase/firestore";
import expoConstants from "expo-constants";

const db = getFirestore();

if (__DEV__) {
  const debuggerHost = expoConstants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0] ?? "localhost";
  console.log(`Connecting to Firestore Emulator at ${localhost}:8080`);

  try {
    connectFirestoreEmulator(db, localhost, 8080);
  } catch (e) {
    console.error("Error connecting to emulator:", e);
  }
}

export default db;
