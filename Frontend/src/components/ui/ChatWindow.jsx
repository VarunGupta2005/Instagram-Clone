import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
// CHANGE 1: Import the new action from your slice
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChat, setMessageList } from '../../redux/chatSlice.js';
import { Info, Smile, Mic, Image as ImageIcon, Loader2 } from 'lucide-react';
import useGetInst from '../../hooks/useGetInst.jsx'
const MessageBubble = ({ message, isOwnMessage }) => (
  <div className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-zinc-100 dark:bg-zinc-700'}`}>
      <p>{message.message}</p>
    </div>
  </div>
);

const ChatWindow = ({ setReRender }) => {
  useGetInst();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(store => store.auth);

  // CHANGE 2: Get selectedChat AND messageList from the global store.
  // We alias `messageList` to `messages` so the rest of the component (like the .map) doesn't need to change.
  const { selectedChat, messageList: messages } = useSelector(store => store.chat);

  const chatPartner = selectedChat?.user;
  const conversationId = selectedChat?.conversationId;

  // CHANGE 3: The local state for messages is now removed.
  // const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const canMessage = useMemo(() => {
    if (!selectedChat) return false;
    return selectedChat.status;
  }, [selectedChat]);

  // This effect for auto-scrolling is perfect and now works with Redux state.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Main effect to fetch messages for the selected conversation.
  useEffect(() => {
    const fetchConversationData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.post(
          'http://localhost:3000/user/getMessages',
          { conversationId: conversationId },
          { withCredentials: true }
        );
        // CHANGE 4: Instead of setting local state, dispatch to Redux.
        if (res.data.success) {
          dispatch(setMessageList(res.data.messages));
        } else {
          dispatch(setMessageList([]));
        }
      } catch (error) {
        toast.error("Could not load conversation.");
        dispatch(setMessageList([]));
      } finally {
        setIsLoading(false);
      }
    };

    if (conversationId) {
      fetchConversationData();
    } else {
      // Clear messages in Redux if no conversation is selected.
      dispatch(setMessageList([]));
    }
  }, [conversationId, dispatch]); // Added dispatch to dependency array for best practice.


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatPartner || !canMessage) return;

    let currentConversationId = conversationId;
    const tempId = `temp_${Date.now()}`;
    const messageToSend = newMessage.trim();

    const tempMessage = {
      _id: tempId,
      message: messageToSend,
      senderId: currentUser._id,
    };

    // CHANGE 5: All state updates now dispatch to Redux.
    // Optimistic UI Update: Add the temporary message to the global list.
    const optimisticMessages = [...messages, tempMessage];

    // 2. Dispatch this new state for the optimistic UI update.
    dispatch(setMessageList(optimisticMessages));
    setNewMessage('');

    try {
      if (!currentConversationId) {
        const createRes = await axios.post(
          'http://localhost:3000/user/createConversation',
          { receiver: chatPartner.username },
          { withCredentials: true }
        );
        setReRender(prev => !prev); // Trigger a re-render to update the chat list.

        if (createRes.data.success) {
          currentConversationId = createRes.data.conversationId;
          dispatch(setSelectedChat({ user: chatPartner, conversationId: currentConversationId, status: true }));
        } else {
          throw new Error(createRes.data.message || "Failed to create conversation.");
        }
      }

      const sendRes = await axios.post(
        'http://localhost:3000/user/sendMessage',
        { text: messageToSend, conversationId: currentConversationId },
        { withCredentials: true }
      );

      if (sendRes.data.success && sendRes.data.text) {
        // Success: Replace the temporary message with the real one from the server.
        // We get the latest list (which includes our temp message) from the `messages` variable
        // and create the new, final list.
        const finalMessages = optimisticMessages.map(m =>
          m._id === tempId ? sendRes.data.text : m
        );
        dispatch(setMessageList(finalMessages));
      } else {
        throw new Error(sendRes.data.message || "Failed to send message.");
      }

    } catch (error) {
      toast.error(error.message || "Message failed to send.");
      // Rollback: remove the temporary message on failure from the global list.
      const rolledBackMessages = optimisticMessages.filter(m => m._id !== tempId);
      dispatch(setMessageList(rolledBackMessages));
    }
  };


  // --- RENDER LOGIC (No changes needed below this line) ---

  if (!selectedChat || !chatPartner) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
        <svg aria-label="Direct" className="h-24 w-24 text-black dark:text-white" fill="currentColor" viewBox="0 0 96 96"><path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.533 48-48S74.468 0 48 0zm0 88C26.033 88 8 69.967 8 48S26.033 8 48 8s40 17.967 40 40-17.967 40-40 40zm22-48.5c0-3.038-2.462-5.5-5.5-5.5H31.5c-3.038 0-5.5 2.462-5.5 5.5v25c0 3.038 2.462 5.5 5.5 5.5h12.067l10.266 8.41c.88.72 2.166.133 2.166-1.002V64.5h2.5c3.038 0 5.5-2.462 5.5-5.5v-25z"></path></svg>
        <h2 className="text-2xl mt-4">Your Messages</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Select a conversation or start a new one.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex-1 flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-white dark:bg-black text-black dark:text-white">
      <header className="flex items-center justify-between p-3.5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${chatPartner.username}`}>
            <img src={chatPartner.profilePicture} alt={chatPartner.username} className="w-11 h-11 rounded-full object-cover" />
          </Link>
          <span className="font-semibold">{chatPartner.username}</span>
        </div>

      </header>

      <main className="flex-1 flex flex-col overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center gap-2 pb-16">
            <img src={chatPartner.profilePicture} alt={chatPartner.username} className="w-24 h-24 rounded-full object-cover" />
            <p className="text-xl font-bold">{chatPartner.name || chatPartner.username}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{chatPartner.username}</p>
            <Link to={`/profile/${chatPartner.username}`} className="mt-4 px-4 py-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-sm font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
              View profile
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map(msg => (
              <MessageBubble key={msg._id} message={msg} isOwnMessage={msg.senderId === currentUser._id || msg.senderId?._id === currentUser._id} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="p-4 mt-auto">
        {canMessage ? (
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 py-2 px-4 border border-zinc-300 dark:border-zinc-600 rounded-full">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Message..." className="flex-1 bg-transparent focus:outline-none placeholder:text-zinc-500" />
            {newMessage.trim() ? (
              <button type="submit" className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">Send</button>
            ) : (
              <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
              </div>
            )}
          </form>
        ) : (
          <div className="text-center p-3 text-sm text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-600 rounded-full">
            You cannot message this user.
          </div>
        )}
      </footer>
    </div>
  );
};

export default ChatWindow;