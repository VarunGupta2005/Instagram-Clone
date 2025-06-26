import { setMessageList } from '../redux/chatSlice.js';
import { use, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSocket } from '../lib/SocketContext.jsx';
import { useSelector } from 'react-redux';
const useGetInst = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { messageList, selectedChat } = useSelector(store => store.chat);
  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      if (selectedChat?.conversationId === newMessage.conversationId)
        dispatch(setMessageList([...messageList, newMessage]));
    })
    return () => {
      socket?.off('newMessage');
    }
  }, [messageList, setMessageList])
}
export default useGetInst;