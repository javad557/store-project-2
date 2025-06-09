import { useState, useEffect } from "react";
import axios from "axios";

function Test() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/test")
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.error(err));
  }, []);
  return <div>{message || "Loading..."}</div>;
}

export default Test;
