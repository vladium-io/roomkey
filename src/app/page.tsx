'use client';

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Home(){
  useEffect(() => {
    const socket = io();

    socket.on('connect', () => {
      console.log('client connected');
    });

    return () => {
      socket.disconnect();
    };

  }, []);

  return (
    <div>
      socket test
    </div>
  )
}