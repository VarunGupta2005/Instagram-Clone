import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { X, Search, Loader2 } from 'lucide-react';
import ChatWindow from './ChatWindow.jsx';
import { setSelectedChat } from '../../redux/chatSlice.js';
import { useDispatch } from 'react-redux';
// --- Sub-Components for a Cleaner Structure ---

// A single item in the conversation list (existing conversations)
const ConversationItem = ({ name, picture, isOnline, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 p-3 mx-2 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
  >
    {/* Wrap image in a relative container to position the dot */}
    <div className="relative flex-shrink-0">
      <img
        src={picture}
        alt={name}
        className="w-14 h-14 rounded-full object-cover bg-zinc-200 dark:bg-zinc-700"
      />
      {/* Conditionally render the green dot if the user is online */}
      {isOnline && (
        <span
          className="absolute bottom-0 right-0 block h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"
          title="Online"
        />
      )}
    </div>
    <span className="font-medium">{name}</span>
  </div>
);

// A single user item in the search results list
const UserSearchResult = ({ user, onSelect }) => (
  <div onClick={() => onSelect(user)} className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
    <img src={user.profilePicture} alt={user.username} className="w-11 h-11 rounded-full object-cover bg-zinc-200 dark:bg-zinc-700" />
    <div className="flex flex-col">
      <span className="font-semibold">{user.username}</span>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{user.name || "User"}</span>
    </div>
  </div>
);

// The Modal for starting a new message/conversation
const NewMessageModal = ({ isOpen, onClose, onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus the input when the modal opens
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery(''); // Reset state on open
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:3000/user/search?q=${query}`, { withCredentials: true });
          if (res.data.success) {
            setResults(res.data.users);
          }
        } catch (error) {
          toast.error("Failed to search for users.");
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }, 300); // A slightly shorter debounce for a more responsive feel

    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!isOpen) return null;

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      {/* Modal Content */}
      <div className="relative w-full max-w-md h-[60vh] bg-white dark:bg-zinc-900 rounded-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-8"></div> {/* Spacer */}
          <h2 className="font-bold">New Message</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X size={20} />
          </button>
        </header>

        {/* Search Input */}
        <div className="flex items-center gap-3 p-3 border-b border-zinc-200 dark:border-zinc-800">
          <label htmlFor="user-search" className="font-bold">To:</label>
          <input
            ref={inputRef}
            id="user-search"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none"
          />
          {loading && <Loader2 className="animate-spin text-zinc-500" size={20} />}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((user) => (
              <UserSearchResult key={user._id} user={user} onSelect={onSelectUser} />
            ))
          ) : (
            !loading && query && <p className="text-center text-zinc-500 p-4">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---

const MessagesPage = () => {
  const { user: currentUser } = useSelector(store => store.auth);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedNewUser, setSelectedUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [rerender, setRerender] = useState(false);
  const { onlineUsers } = useSelector(store => store.chat);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSelectedChat(null));
    }
  }, [])
  useEffect(() => {
    // ... fetching conversations logic remains the same ...
    if (!currentUser) return;
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/user/getConvs', { withCredentials: true });
        if (res.data.success) {
          setConversations(res.data.conversations);
          console.log("Fetched conversations:", res.data.conversations);
        }
      } catch (err) {
        toast.error("Failed to fetch conversations.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, [currentUser, rerender]);

  const getConversationDetails = (conv) => {
    if (conv?.isGroup) {
      return { name: conv.groupName, picture: `https://ui-avatars.com/api/?name=${conv.groupName?.charAt(0)}` };
    }
    const other = conv?.participants?.find(p => p.username !== currentUser.username);
    return { username: other?.username, profilePicture: other?.profilePicture, _id: other?._id };
  };

  const handleSelectUser = async (selectedUser) => {
    setIsSearchOpen(false); // 1. Close the modal
    try {
      const res = await axios.post('http://localhost:3000/user/fetchConversation', { receiver: selectedUser.username }, { withCredentials: true });
      if (res.data.success && res.data.conversationId) {


        setConversationId(res.data.conversationId);
        setSelectedUser({ user: selectedUser, status: true });
        dispatch(setSelectedChat({ user: selectedUser, status: true, conversationId: res.data.conversationId }));
      }
    } catch (error) {

      const canMessageUser = currentUser.following.includes(selectedUser._id) || selectedUser.privacy === "Public";

      if (canMessageUser) {
        // **THE KEY FIX:** Create the object that ChatWindow expects
        setSelectedUser({ user: selectedUser, status: true });
        setConversationId(null); // Explicitly set conversationId to null for a new chat
        dispatch(setSelectedChat({ user: selectedUser, status: true, conversationId: null }));
      } else {
        toast.error("You cannot message this user because you don't follow them.");
        // OPTIONAL: You could still show their profile but with messaging disabled
        setSelectedUser({ user: selectedUser, status: false });
        setConversationId(null);
        dispatch(setSelectedChat({ user: selectedUser, status: false, conversationId: null }));
      }

      console.log(error);
    }
  };
  if (!currentUser) {

    return <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">Loading...</div>
  }

  return (
    <>
      <div className="flex h-screen w-full bg-white dark:bg-black text-black dark:text-white">
        {/* Conversations Sidebar */}
        <div className="w-[25%] flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
          {/* Header */}
          <header className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">{currentUser.username}</h1>
              {/* NEW MESSAGE ICON */}
              <button onClick={() => setIsSearchOpen(true)} title="New Message">
                <svg aria-label="New message" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.547a3 3 0 0 0 3-3v-6.952" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.848" x2="20.076" y1="3.924" y2="7.153"></line></svg>
              </button>
            </div>
          </header>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto py-2">
            {isLoading ? <p className="text-center text-zinc-500 p-4">Loading...</p> : conversations.length === 0 ? <p className="text-center text-zinc-500 p-4">No messages found.</p> :
              conversations.map(conv => {
                const details = getConversationDetails(conv);
                return <ConversationItem key={conv._id} isOnline={onlineUsers.includes(details._id)} name={details.username} picture={details.profilePicture} onClick={() => { setSelectedUser({ user: details, status: true }); dispatch(setSelectedChat({ user: details, status: true, conversationId: conv._id })); setConversationId(conv._id) }} />;
              })
            }
          </div>
        </div>

        {/* Main Chat Area - This should be replaced by a chat component when a conversation is selected */}
        <ChatWindow setReRender={setRerender} />
      </div>

      {/* RENDER THE MODAL */}
      <NewMessageModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectUser={handleSelectUser}
      />
    </>
  );
};

export default MessagesPage;