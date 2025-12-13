import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useToastNotification } from "./NotificationContext";
import type { wsMessageDTO } from "../dto/wsMessageDTO";
import { useNotificationStore } from "../hooks/hookNotificationStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface WebSocketContextType {
  messages: wsMessageDTO[];
}

export const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const clientRef = useRef<Client | null>(null);
    const [messages, setMessages] = useState<wsMessageDTO[]>([]);
    const { addToastNotification } = useToastNotification();
    const { addNotification } = useNotificationStore();

    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === "token") setToken(localStorage.getItem("token"));
        };
        const onTokenChanged = () => setToken(localStorage.getItem("token"));

        window.addEventListener("storage", onStorage);
        window.addEventListener("tokenChanged", onTokenChanged);

        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("tokenChanged", onTokenChanged);
        };
    }, []);

    useEffect(() => {
        if (!token) {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
            return;
        }

        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
            connectHeaders: {
                Authorization: "Bearer " + token,
            },
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            client.subscribe("/user/queue/notifications", (msg) => {
                try {
                    const data: wsMessageDTO = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, data]);
                    addToastNotification(data.message, false);
                    addNotification(data);
                } catch (err) {
                    console.error("Falha ao analisar mensagem", err);
                }
            });

            client.subscribe("/topic/news", (msg) => {
                try {
                    const data: wsMessageDTO = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, data]);
                    addToastNotification(data.message, false);
                    addNotification(data);
                } catch (err) {
                    console.error("Falha ao analisar mensagem", err);
                }
            });
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            clientRef.current = null;
        };
    }, [token]);

    return (
        <WebSocketContext.Provider value={{messages}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error("useWebSocket must be used with WebSocketProvider");
    return context;
};