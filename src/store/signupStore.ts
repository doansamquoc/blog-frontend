import { create } from "zustand";
type SignupData = {
  dateOfBirth: Date;
  gender: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type SignupState = {
  step: number;
  data: SignupData;
  next: () => void;
  back: () => void;
  update: (partial: Partial<SignupData>) => void;
};

export const useSignupStore = create<SignupState>((set) => ({
  step: 1,
  data: {
    dateOfBirth: new Date(),
    gender: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  },
  next: () => set((s) => ({ step: s.step + 1 })),
  back: () => set((s) => ({ step: s.step - 1 })),
  update: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),
}));
