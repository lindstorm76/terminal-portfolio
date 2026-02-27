import { useState } from "react";
import History from "./components/History";
import Prompt from "./components/Prompt";

function App() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <>
      <History onBootComplete={() => setIsBooting(false)} />
      {!isBooting && <Prompt />}
    </>
  );
}

export default App;
