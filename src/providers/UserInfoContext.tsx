import { createContext, useContext, useState } from "react";
import randomName from "@scaleway/random-name";

interface UserInfo {
  username: string;
  domain: string;
}

const UserInfoContext = createContext<UserInfo | null>(null);

export const UserInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userInfo] = useState<UserInfo>(() => ({
    username: randomName(),
    domain: "terminal.thanapong.dev",
  }));

  return (
    <UserInfoContext.Provider value={userInfo}>
      {children}
    </UserInfoContext.Provider>
  );
};

export function useUserInfo() {
  const context = useContext(UserInfoContext);
  if (!context)
    throw new Error("useUserInfo must be used within UserInfoProvider");
  return context;
}
