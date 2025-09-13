import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions";

admin.initializeApp();
setGlobalOptions({ maxInstances: 10 });
