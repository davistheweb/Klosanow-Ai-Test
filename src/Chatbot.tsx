"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import { Send, Bot, User } from "lucide-react";
// import ReactMarkdown from "react-markdown";

type Message = {
  sender: "user" | "bot";
  text: string;
};

const KLOSANOW_ENDPOINT_URL = import.meta.env.VITE_KLOSANOW_AI_ENDPOINT_URL;
if (!KLOSANOW_ENDPOINT_URL)
  throw new Error("KLOSANOW_AI_ENDPOINT_URL is not found");

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Prepare payload: all chats as JSON string
      const payload = {
        message: JSON.stringify(updatedMessages),
      };

      const res = await axios.post(KLOSANOW_ENDPOINT_URL, payload);

      const botMessage: Message = {
        sender: "bot",
        text: res.data.message, // API should return `message`
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Try again!" },
      ]);
    } finally {
      setIsLoading(false);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-[600px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">AI Assistant</h2>
            <p className="text-primary-foreground/80 text-sm">
              Always here to help
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background/50 to-muted/20">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Bot className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm">Ask me anything you'd like to know!</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {msg.sender === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-md"
                  : "bg-card border border-border rounded-tl-md"
              }`}
            >
              {/* <p>{msg.text.replace(/\n/g, "<br/>")}</p> */}

              <p
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: msg.text,
                }}
              />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-md shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-card border-t border-border">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder="Type your message..."
              disabled={isLoading}
            />
          </div>
          <button
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
