import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const socketIo = io();

        socketIo.on('connect', () => {
            setIsConnected(true);
        });

        socketIo.on('disconnect', () => {
            setIsConnected(false);
        });

        socketIo.on('message', (msg: string) => {
            setMessages((prev) => [...prev, msg]);
        });

        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
        };
    }, []);

    const sendMessage = (message: string) => {
        socket?.emit('message', message);
    };

    return { isConnected, messages, sendMessage };
};