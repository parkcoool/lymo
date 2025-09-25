import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions";

import firebaseAccountCredentials from "../serviceAccountKey.json";

const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
setGlobalOptions({ maxInstances: 10 });
