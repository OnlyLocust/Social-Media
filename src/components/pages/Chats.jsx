"use client";
import { useEffect, useMemo } from "react";

import { useState } from "react";
import SearchBox from "../common/chatPage/Search";
import AllUsersChat from "../common/chatPage/AllUsersChat";
import MessageInput from "../common/chatPage/MessageInput";
import ChatHeader from "../common/chatPage/ChatHeader";
import ChatArea from "../common/chatPage/ChatArea";
import NoChat from "../common/chatPage/NoChat";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserChats } from "@/store/chatSlice";
import { toast } from "sonner";
import { askOnline } from "@/lib/socket";
import { API_URL } from "@/constants/constant";

export default function MessagesPage() {
  const dispatch = useDispatch();

  const chatUsers = useSelector((state) => state.chat.chatUsers);

  const recvId = useSelector((state) => state.chat.recv);

  const [loading, setLoading] = useState(false);

  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    askOnline();
  }, [chatUsers]);

  const filteredChats = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return chatUsers;

    return chatUsers.filter((chat) =>
      chat.member.username.toLowerCase().includes(term)
    );
  }, [chatUsers, searchTerm]);

  useEffect(() => {
    const getChatUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/chat/chatusers`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUserChats(res.data.chatUsers));
        } else {
          throw new Error(
            res.data.message || "Failed to fetch all users for chat"
          );
        }
      } catch (error) {
        toast.error(
          error.message ||
            error.data.message ||
            "Failed to fetch all users for chat"
        );
      } finally {
        askOnline();
        setLoading(false);
      }
    };

    getChatUsers();
  }, []);

  return (
    <div className="flex h-screen border rounded-lg overflow-hidden ">
      <div className="w-full md:w-1/3 border-r bg-gray-50">
        <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <AllUsersChat
          filteredChats={filteredChats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          loading={loading}
        />
      </div>

      <div className="hidden md:flex flex-col w-2/3 bg-white h-full">
        {activeChat ? (
          <>
            <ChatHeader activeChat={activeChat} chatUsers={chatUsers} />

            <div className="flex-1 overflow-hidden ">
              {" "}
              <ChatArea recvId={recvId} activeChat={activeChat} />
            </div>

            <MessageInput recvId={recvId} />
          </>
        ) : (
          <NoChat />
        )}
      </div>
    </div>
  );
}
