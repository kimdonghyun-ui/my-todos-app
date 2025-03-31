import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface ChatRoom {
  id: string;
  type: 'direct' | 'public';
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
}

interface ChatStore {
  currentUser: User;
  friends: User[];
  chatRooms: ChatRoom[];
  publicRoom: ChatRoom;
  
  // Actions
  addFriend: (friend: User) => void;
  removeFriend: (friendId: string) => void;
  createDirectRoom: (friend: User) => void;
  sendMessage: (roomId: string, content: string) => void;
  sendPublicMessage: (content: string) => void;
}

// 임시 현재 사용자
const currentUser: User = {
  id: '1',
  name: '나',
  status: 'online'
};

// 임시 친구 데이터
const initialFriends: User[] = [
  {
    id: '2',
    name: '친구1',
    status: 'online'
  },
  {
    id: '3',
    name: '친구2',
    status: 'offline'
  }
];

export const useChatStore = create<ChatStore>((set, get) => ({
  currentUser,
  friends: initialFriends,
  chatRooms: [],
  publicRoom: {
    id: 'public',
    type: 'public',
    participants: [],
    messages: [],
  },

  addFriend: (friend) => set((state) => ({
    friends: [...state.friends, friend]
  })),

  removeFriend: (friendId) => set((state) => ({
    friends: state.friends.filter(f => f.id !== friendId)
  })),

  createDirectRoom: (friend) => {
    const state = get();
    const existingRoom = state.chatRooms.find(room => 
      room.type === 'direct' && 
      room.participants.some(p => p.id === friend.id)
    );

    if (!existingRoom) {
      set((state) => ({
        chatRooms: [...state.chatRooms, {
          id: Math.random().toString(36).substring(2, 9),
          type: 'direct',
          participants: [state.currentUser, friend],
          messages: []
        }]
      }));
    }
  },

  sendMessage: (roomId, content) => set((state) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: state.currentUser.id,
      content,
      timestamp: new Date().toISOString()
    };

    return {
      chatRooms: state.chatRooms.map(room => 
        room.id === roomId
          ? { ...room, messages: [...room.messages, newMessage], lastMessage: newMessage }
          : room
      )
    };
  }),

  sendPublicMessage: (content) => set((state) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: state.currentUser.id,
      content,
      timestamp: new Date().toISOString()
    };

    return {
      publicRoom: {
        ...state.publicRoom,
        messages: [...state.publicRoom.messages, newMessage],
        lastMessage: newMessage
      }
    };
  })
})); 