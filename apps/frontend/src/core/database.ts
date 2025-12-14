import { connectDatabaseEmulator, getDatabase } from "@react-native-firebase/database";
import expoConstants from "expo-constants";

const database = getDatabase();

if (__DEV__) {
  const debuggerHost = expoConstants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0] ?? "localhost";
  console.log(`Connecting to Database Emulator at ${localhost}:9000`);

  try {
    connectDatabaseEmulator(database, localhost, 9000);
  } catch (e) {
    console.error("Error connecting to emulator:", e);
  }
}

export default database;
