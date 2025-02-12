'use client';

import { useState, useEffect, useRef } from "react";
import { useSocket } from '@/hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Wifi, WifiOff } from "lucide-react"

interface Message {
  id: string;
  text: string;
  time: Date;
  isSent: boolean;
}

export default function Home() {
  const { isConnected, messages: socketMessages, sendMessage } = useSocket();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newMessages = socketMessages.map(msg => {
      if (typeof msg === 'string') {
        return { id: uuidv4(), text: msg, time: new Date(), isSent: false };
      }
      return { ...msg, id: msg.id || uuidv4(), isSent: false };
    });

    setMessages(prevMessages => {
      // Filter out any duplicates based on the id
      const uniqueNewMessages = newMessages.filter(
        newMsg => !prevMessages.some(prevMsg => prevMsg.id === newMsg.id)
      );
      return [...prevMessages, ...uniqueNewMessages];
    });
  }, [socketMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newMessage = { id: uuidv4(), text: inputMessage, time: new Date(), isSent: true };
      sendMessage(newMessage);
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Chat Room</CardTitle>
          <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1 w-fit">
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          {/* <br />
          <div className="h-px bg-border rounded-full mx-auto w-[97%] mt-4" /> */}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-2 ${msg.isSent ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.isSent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.text}
                </span>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.time).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">

            {/* TODO: ADD FILE UPLOAD HANDLING */}

            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!isConnected}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}