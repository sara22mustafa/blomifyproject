import { createContext, useState } from "react";
export let UserContext = createContext();

export default function UserContxtProvider(props) {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || null);
  const adminId = "fl4bsrOmOAYE6sIzaU4Nxwg4Z5G2";

  return (
    <UserContext.Provider value={{ userToken, setUserToken ,userId,setUserId,adminId}}>
      {props.children}
    </UserContext.Provider>
  );
}
