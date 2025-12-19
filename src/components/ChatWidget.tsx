// src/components/ChatWidget.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import api from "../api/axios";
import { toast } from "react-toastify";
import useAuth from "../auth/useAuth";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

/**
 * 🤖 AI Chat Widget - Floating chat assistant
 * Features:
 * - Floating button at bottom-right
 * - Expandable chat window
 * - Conversation history
 * - Auto-scroll to bottom
 * - Christmas theme
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "👋 Xin chào! Tôi là Claude AI, trợ lý về chất lượng không khí. Tôi có thể giúp bạn hiểu về AQI, PM2.5, và cách bảo vệ sức khỏe. Bạn muốn hỏi gì?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await api.post("/ai/chat", {
        message: inputMessage,
        history: messages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
        userContext: user?.role || "USER",
      });

      if (response.data && response.data.success) {
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: response.data.message,
          timestamp: response.data.timestamp,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        toast.error("❌ Claude không thể trả lời");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("❌ Lỗi khi gửi tin nhắn");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: "fixed",
              bottom: 30,
              right: 30,
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              border: "3px solid #FFD700",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
              cursor: "pointer",
              zIndex: 9998,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            🧠
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            style={{
              position: "fixed",
              bottom: 30,
              right: 30,
              width: 400,
              height: 600,
              maxWidth: "90vw",
              maxHeight: "80vh",
              borderRadius: 24,
              background: "white",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              border: "3px solid #667eea",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "28px" }}>🧠</span>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Claude AI
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.9 }}>
                    Air Quality Assistant
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Messages Container */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                background: "linear-gradient(135deg, #E0F7FA 0%, #FFFAFA 100%)",
              }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "12px 16px",
                      borderRadius: 16,
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #667eea, #764ba2)"
                          : "white",
                      color: msg.role === "user" ? "white" : "#475569",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.role === "assistant" && (
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.7,
                          marginBottom: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span>🧠</span> Claude AI
                      </div>
                    )}
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 16px",
                    background: "white",
                    borderRadius: 16,
                    maxWidth: "80%",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#667eea" }}>
                    🧠 Claude đang suy nghĩ
                  </span>
                  <div className="d-flex gap-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#667eea",
                      }}
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#667eea",
                      }}
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#667eea",
                      }}
                    />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "16px",
                background: "white",
                borderTop: "2px solid #E5E7EB",
              }}
            >
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Hỏi Claude về chất lượng không khí..."
                  disabled={isTyping}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "2px solid #E5E7EB",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    border: "none",
                    borderRadius: 12,
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: inputMessage.trim() && !isTyping ? "pointer" : "not-allowed",
                    opacity: inputMessage.trim() && !isTyping ? 1 : 0.5,
                  }}
                >
                  <FaPaperPlane color="white" size={18} />
                </motion.button>
              </div>

              {/* Quick Suggestions */}
              <div
                className="d-flex gap-2 mt-2"
                style={{ overflowX: "auto", paddingBottom: 4 }}
              >
                {["AQI là gì?", "PM2.5 nguy hiểm thế nào?", "Nên đeo khẩu trang gì?"].map(
                  (suggestion, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setInputMessage(suggestion)}
                      style={{
                        background: "rgba(102, 126, 234, 0.1)",
                        border: "1px solid rgba(102, 126, 234, 0.3)",
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontSize: "12px",
                        color: "#667eea",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {suggestion}
                    </motion.button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}