import axios from "axios";
import React, { useEffect, useState } from "react";
import "../styles/Connection.css"


const CheckConn: React.FC = () =>{
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        axios
          .get("http://localhost:8080/api/initiallize")
          .then((response) => {
            setMessage(response.data);
          })
          .catch(() => {
            setMessage("Erro: Ligação mal sucedida");
          });
      }, []);

      return <div className="connection">{message || "A estabelecer ligação..."}</div>;
}

export default CheckConn;