import {
  onAuthStateChanged,
  signInAnonymously,
  type FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import { createElement, useState, ReactNode, useEffect } from "react";
import { buildContext } from "react-simplikit";

import auth from "@/core/auth";

interface UserContextStates {
  user: FirebaseAuthTypes.User | null;
}

interface UserContextActions {
  setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
}

type UserContextValues = UserContextStates & UserContextActions;

const [UserContextProvider, useUserStore] = buildContext<UserContextValues>("UserContext", {
  user: null,
  setUser: () => {},
});

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContextStates["user"]>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // 사용자가 로그인되어 있으면 상태 업데이트
      if (user) {
        setUser(user);
        console.log(
          `User is signed in with UID: ${user.uid}${user.isAnonymous ? " (anonymous)" : ""}`
        );
      }

      // 로그인되지 않았으면 익명 로그인
      else {
        await signInAnonymously(auth);
      }
    });

    return unsubscribe;
  }, []);

  // react-simplikit의 buildContext에서 생성된 Provider는 children을 props로 받도록 설계됨
  // eslint-disable-next-line react/no-children-prop
  return createElement(UserContextProvider, { user, setUser, children });
}

export { UserProvider, useUserStore };
