import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./AIAgent.module.css"; // Import the CSS module

const AIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  // Load the last conversation on mount
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("ai_agent_chat")) || [];
    setMessages(savedMessages);
  }, []);

  // Scroll to the latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending message
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: "user" };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:8080/api/ai-agent", {
        studyTopic: input,
        token,
      });

      const aiMessage = { text: res.data.response, sender: "ai" };
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      localStorage.setItem("ai_agent_chat", JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { text: "Failed to get response.", sender: "ai" }]);
    }

    setLoading(false);
  };

  // Clear messages when closing
  const closeAgent = () => {
    localStorage.removeItem("ai_agent_chat");
    setMessages([]);
    setIsOpen(false);
  };

  return (
<>
  {/* Floating AI Button */}
  <motion.button
    className={styles.ai__agent__btn__ai__Agent}
    onClick={() => setIsOpen(true)}
    whileTap={{ scale: 0.9 }}
    whileHover={{ scale: 1.05 }}
  >
    💬
  </motion.button>

  {/* AI Agent Chat Modal */}
  {isOpen && (
    <motion.div
      className={styles.ai__agent__container__ai__Agent}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className={styles.ai__agent__header__ai__Agent}>
        <span>AI Study Assistant</span>
        <span className={styles.ai__agent__close__ai__Agent} onClick={closeAgent}>✖</span>
      </div>

      {/* Chat Messages */}
      <div className={styles.ai__agent__chat__ai__Agent} ref={chatRef}>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`${styles.ai__agent__message__ai__Agent} ${msg.sender === "user" ? styles.user__ai__Agent : styles.ai__ai__Agent}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {msg.text}
          </motion.div>
        ))}
        {loading && (
          <div className={styles.ai__agent__typing__ai__Agent}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={styles.ai__agent__input__wrapper__ai__Agent}>
        <input
          className={styles.ai__agent__input__ai__Agent}
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <motion.button
          className={styles.ai__agent__send__ai__Agent}
          onClick={sendMessage}
          whileTap={{ scale: 0.9 }}
        >
          ➤
        </motion.button>
      </div>
    </motion.div>
  )}
</>

  );
};

export default AIAgent;
