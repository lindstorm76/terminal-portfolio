import { useUserInfo } from "./hooks/useUserInfo";

function App() {
  const { username, domain } = useUserInfo();
  return (
    <p>
      {username}@{domain}
    </p>
  );
}

export default App;
