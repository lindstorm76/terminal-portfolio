import { useState } from "react";
import randomName from "@scaleway/random-name";

interface UserInfo {
  username: string;
  domain: string;
}

export function useUserInfo() {
  const [userInfo] = useState<UserInfo>(() => ({
    username: randomName(),
    domain: "terminal.thanapong.dev",
  }));

  return userInfo;
}
