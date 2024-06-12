import { create } from "zustand";
import { GroupChat, Message } from "../api/groupchats";

type GroupChatStore = {
  groupChats: GroupChat[];
  setGroupChats: (groupChats: GroupChat[]) => void;
  addGroupChat: (groupChat: GroupChat) => void;
  addMessage: (groupId: string, message: Message) => void;
};

export const useGroupchatStore = create<GroupChatStore>((set) => ({
  groupChats: [],
  setGroupChats: (groupChats: GroupChat[]) => {
    set({ groupChats });
  },
  addGroupChat: (groupChat: GroupChat) => {
    set((state) => ({
      groupChats: [...state.groupChats, groupChat],
    }));
  },
  addMessage: (groupId: string, message: Message) => {
    set((state) => {
      const groupChat = state.groupChats.find(
        (groupChat) => groupChat.group_id === groupId
      );
      if (!groupChat) return state;

      return {
        groupChats: state.groupChats.map((groupChat) => {
          if (groupChat.group_id === groupId) {
            return {
              ...groupChat,
              messages: [...groupChat.messages, message],
            };
          }
          return groupChat;
        }),
      };
    });
  },
}));

export const useGetGroupChat: (groupId: string) => GroupChat = (
  groupId: string
) => {
  return useGroupchatStore
    .getState()
    .groupChats.find((groupChat) => groupChat.group_id === groupId)!;
};
