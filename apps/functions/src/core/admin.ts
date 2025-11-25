import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions";

admin.initializeApp({
  credential: applicationDefault(),
});

admin.firestore().settings({ databaseId: "main" });

setGlobalOptions({ maxInstances: 10 });
