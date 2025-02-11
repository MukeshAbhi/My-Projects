import { atom } from "recoil";

export const themeAtom = atom<string>({
    key: 'themeAtom',
    default: JSON.parse(window?.localStorage.getItem('theme')!) ?? 'dark',
})

