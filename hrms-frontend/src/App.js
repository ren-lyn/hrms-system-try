import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:8000/api/test")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  return <h1>Check the console for API response</h1>;
}

export default App;
