import { useState } from "react";
import History from "./components/History";
import Prompt from "./components/Prompt";

function App() {
  const [bootKey, setBootKey] = useState(0);
  const [isBooting, setIsBooting] = useState(true);

  const handleReboot = () => {
    setIsBooting(true);
    setBootKey((prev) => prev + 1);
  };

  return (
    <>
      <History key={bootKey} onBootComplete={() => setIsBooting(false)} />
      {!isBooting && <Prompt onReboot={handleReboot} />}
    </>
  );
}

export default App;
