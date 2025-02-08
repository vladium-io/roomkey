import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const usesocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isconnected, setIsconnected] = useState<boolean>(false);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const socketIo = io();

        socketIo.on('connect', () => {
            setIsconnected(true);
        });

        socketIo.on('disconnect', () => {
            setIsconnected(false);
        });

        socketIo.on('message', (message: string) => {
            setMessages((prev) => [...prev, message]);
        });

        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
        }
    }, []);

    const sendMessage = (message: string) => {
        socket?.emit('message', message);
    };

    return { isconnected, messages, sendMessage };