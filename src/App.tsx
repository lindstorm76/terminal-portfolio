import { useEffect, useRef, useState } from "react";
import History from "./components/History";
import Prompt from "./components/Prompt";
import { useHistory } from "./providers/HistoryContext";

function App() {
  const [bootKey, setBootKey] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const { lines } = useHistory();
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleReboot = () => {
    setIsBooting(true);
    setBootKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isBooting) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, isBooting]);

  return (
    <>
      <History key={bootKey} onBootComplete={() => setIsBooting(false)} />
      {!isBooting && <Prompt onReboot={handleReboot} />}
      <div ref={bottomRef} />
    </>
  );
}

export default App;
