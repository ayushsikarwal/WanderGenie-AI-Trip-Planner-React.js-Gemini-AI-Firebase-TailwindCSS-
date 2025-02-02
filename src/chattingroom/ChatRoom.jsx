import FloatingNavBar from "@/components/ui/custom/FloatingNavBar";
import { db } from "@/services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?";
  return (
    name
      .trim()
      .split(/\s+/)
      .map((word) => word[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
};

const getRandomColor = () => {
  const colors = [
    "#FF6B6B", // Light red
    "#FF8787", // Softer red
    "#FA5252", // Bright red
    "#FF4D4D", // Vibrant red
    "#FF7676", // Pink-red
    "#FF5C5C", // Coral red
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ChatRoom = () => {
  const [username, setUsername] = useState("");
  const [userColor, setUserColor] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const { tripId } = useParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [trip, setTrip] = useState(null); // State for trip data
  
    // Fetch the trip data
    useEffect(() => {
      fetchTripData();
    }, [tripId]); 
  
    const fetchTripData = async () => {
      if (!tripId) return;
  
      const docRef = doc(db, "AITrip", tripId); // Reference to Firestore document
      const snapDoc = await getDoc(docRef); // Fetch the document
  
      if (snapDoc.exists()) {
        setTrip(snapDoc.data()); // Set fetched data to state
        console.log(snapDoc.data())
      }
    };

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          timestamp: new Date(),
          username: data.username || "Anonymous",
        },
      ]);
      scrollToBottom();
    });

    socket.on("user-joined", (userData) => {
      setUsers((prev) => {
        const isUserPresent = prev.some(
          (u) => u.username === userData.username
        );
        if (!isUserPresent) {
          return [
            ...prev,
            {
              ...userData,
              color: getRandomColor(),
            },
          ];
        }
        return prev;
      });
    });

    socket.on("user-left", (userData) => {
      setUsers((prev) => prev.filter((u) => u.username !== userData.username));
    });

    socket.on("existing-users", (userList) => {
      setUsers(
        userList.map((userData) => ({
          ...userData,
          color: getRandomColor(),
        }))
      );
    });

    socket.on("user-typing", ({ username }) => {
      setIsTyping((prev) => [...new Set([...prev, username])]);
      setTimeout(() => {
        setIsTyping((prev) => prev.filter((user) => user !== username));
      }, 3000);
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("existing-users");
      socket.off("user-typing");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview URL for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const joinCommunity = () => {
    if (username.trim()) {
      const color = getRandomColor();
      setUserColor(color);
      socket.emit("join", username.trim());
      setJoined(true);
    }
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit("typing", { username });
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { username });
    }, 2000);
  };

  const sendMessage = async () => {
    if (message.trim() || selectedFile) {
      let fileData = null;

      if (selectedFile) {
        const reader = new FileReader();
        fileData = await new Promise((resolve) => {
          reader.onload = (e) => {
            resolve({
              name: selectedFile.name,
              type: selectedFile.type,
              data: e.target.result,
              size: selectedFile.size,
            });
          };
          reader.readAsDataURL(selectedFile);
        });
      }

      const data = {
        username,
        message: message.trim(),
        replyTo,
        userColor,
        timestamp: new Date(),
        file: fileData,
      };

      socket.emit("send-message", data);
      setMessage("");
      setSelectedFile(null);
      setPreviewUrl("");
      setReplyTo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderFilePreview = (fileData) => {
    if (!fileData) return null;

    if (fileData.type.startsWith("image/")) {
      return (
        <img
          src={fileData.data}
          alt="shared"
          className="max-w-[200px] max-h-[200px] rounded-lg"
        />
      );
    }

    return (
      <div className="bg-gray-50 p-2 rounded-lg mt-2 flex items-center justify-between">
        <span>📎 {fileData.name}</span>
        <a
          href={fileData.data}
          download={fileData.name}
          className="text-red-400 hover:text-red-500 text-sm px-2 py-1 bg-gray-100 rounded-md"
        >
          Download
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-white p-4 font-sans">
      {!joined ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Join the Chat
            </h1>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && joinCommunity()}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-300"
              />
              <button
                onClick={joinCommunity}
                className="px-6 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid pb-[80px] grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-2rem)]">
          <div className="lg:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex flex-col h-full">
                <h2 className="p-4 text-xl font-semibold text-gray-800 border-b border-gray-100">
                  Group Chat
                </h2>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => {
                    const isSender = msg.username === username; // Check if the message is from the current user
                    return (
                      <div
                        key={index}
                        className={`flex ${
                          isSender ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-lg shadow ${
                            isSender
                              ? "bg-red-400 text-white"
                              : "bg-gray-100 text-gray-800"
                          } flex flex-col`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {!isSender && (
                              <span className="font-semibold">
                                {msg.username}
                              </span>
                            )}
                            <span className="text-sm text-gray-500">
                              {msg.timestamp && formatTime(msg.timestamp)}
                            </span>
                          </div>
                          {msg.message && <p>{msg.message}</p>}
                          {msg.file && renderFilePreview(msg.file)}
                          {!isSender && (
                            <button
                              onClick={() => setReplyTo(msg)}
                              className="mt-2 text-sm text-red-500 hover:text-red-600"
                            >
                              Reply
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                  {isTyping.length > 0 && (
                    <div className="text-sm text-gray-500 italic">
                      {isTyping.join(", ")}{" "}
                      {isTyping.length === 1 ? "is" : "are"} typing...
                    </div>
                  )}
                </div>
              </div>

              {replyTo && (
                <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span>Replying to </span>
                    <strong className="text-gray-800">
                      {replyTo.username}
                    </strong>
                  </div>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-300"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
                  >
                    📎
                  </button>
                  <button
                    onClick={sendMessage}
                    className="px-6 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
                {previewUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Online Users ({users.length})
            </h3>
            <div className="space-y-2">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: user.color }}
                  >
                    {getInitials(user.username)}
                  </div>
                  <span className="text-gray-700">{user.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <FloatingNavBar tripId={tripId} />
    </div>
  );
};

export default ChatRoom;
