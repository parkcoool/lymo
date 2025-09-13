import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions";

import serviceAccount from "../serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
setGlobalOptions({ maxInstances: 10 });
