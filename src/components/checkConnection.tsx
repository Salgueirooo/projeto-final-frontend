import React, { useEffect, useState } from "react";
import "../styles/Connection.css"
import api from "../services/api"

const CheckConn: React.FC = () => {
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await api.get("/initiallize");
        setMessage(response.data);
      } catch (err) {
        console.error(err);
        setMessage("Erro: Ligação mal sucedida");
      }
    };

    checkConnection();
  }, []);

    return <div className="connection">{message || "A estabelecer ligação..."}</div>;
}

export default CheckConn;