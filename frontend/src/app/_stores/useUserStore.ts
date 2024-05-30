import { create } from "zustand";

interface UserState {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  setAll: (user: Partial<UserState>) => void;
}

const useUserStore = create<UserState>()((set) => ({
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  setAll: (user) =>
    set((state) => ({
      ...state,
      ...user,
    })),
}));

export default useUserStore;
