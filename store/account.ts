import { create } from "zustand";

interface INeteaseAccount {
  avatarUrl: string;
  userId: number;
  nickname: string;
  userName: string;
}

interface AccountStore {
  neteaseAccount: INeteaseAccount;
  setNeteaseAccount: (netease: INeteaseAccount) => void;
}

export const useAccountStore = create<AccountStore>((set) => ({
  neteaseAccount: {
    avatarUrl: "",
    userId: 0,
    nickname: "",
    userName: "",
  },
  setNeteaseAccount: (neteaseAccount) => set({ neteaseAccount }),
}));
