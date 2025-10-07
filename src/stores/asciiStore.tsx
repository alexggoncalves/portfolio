import { create } from "zustand";

type ASCIIState = {
    charSize: number
    asciiSequence: string
    fontAtlas: string
    setCharSize: (size: number) => void
}

const useAsciiStore = create<ASCIIState>((set) => ({
    charSize: 20,
    fontAtlas: "/fontAtlas-10x10-100px.png",
    asciiSequence: '      .`,:’;_”-!il^Ir1v\\jft*~|LJc/?xT+()7Y<>nuz=y{}oFskVahe[]4CX23AbdpqUZwKPESHG5O0gD69mNQR8B&%MW#$@',
    setCharSize: (size: number) => set({ charSize: size }),
    
}));

export default useAsciiStore