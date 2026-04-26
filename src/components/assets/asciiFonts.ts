export const TitleFont: Record<string, string[]> = {
    A: ["    ", " /\\ ", "/__\\", "    "],
    B: [" __ ", "|__)", "|__)", "    "],
    C: [" __ ", "/  `", "\\__,", "    "],
    D: [" __ ", "|  \\", "|__/", "    "],
    E: [" ___", "|__ ", "|___", "    "],
    F: [" ___", "|__ ", "|   ", "    "],
    G: [" __ ", "/ _`", "\\__>", "    "],
    H: ["    ", "|__|", "|  |", "    "],
    I: [" ", "|", "|", " "],
    J: ["    ", "   |", "\\__/", "    "],
    K: ["    ", "|__/", "|  \\", "    "],
    L: ["    ", "|   ", "|___", "    "],
    M: ["    ", "|\\/|", "|  |", "    "],
    N: ["    ", "|\\ |", "| \\|", "    "],
    O: [" __ ", "/  \\", "\\__/", "    "],
    P: [" __ ", "|__)", "|   ", "    "],
    Q: [" __ ", "/  \\", "\\__X", "    "],
    R: [" __ ", "|__)", "|  \\", "    "],
    S: [" __ ", "/__`", ".__/", "    "],
    T: ["___", " | ", " | ", "   "],
    U: ["    ", "|  |", "\\__/", "    "],
    V: ["    ", "\\  /", " \\/ ", "    "],
    W: ["    ", "|  |", "|/\\|", "    "],
    X: ["   ", "\\_/", "/ \\", "   "],
    Y: ["   ", "\\ /", " | ", "   "],
    Z: ["__", " /", "/_", "  "],
    "-": ["     ", " ___ ", "     ", "     "],
    " ": ["  ", "  ", "  ", "  "],
};

// export function createASCIITitle(title: string): string[][] {
//     const lines: string[][] = [[], [], [], []];

//     for (const char of title.toUpperCase()) {
//         const asciiLetter = TitleFont[char] || TitleFont[" "];

//         for (let y = 0; y < lines.length; y++) {
//             const row = asciiLetter[y] ?? " ";

//             for (let x = 0; x < row.length; x++) {
//                 lines[y].push(row[x]);
//             }

//             // space between letters
//             lines[y].push(" ");
//         }
//     }

//     return lines;
// }

export function createASCIITitle(title: string): string[] {
    const lines: string[] = ["", "", "", ""];
    title = title.toUpperCase();

    for (const char of title) {
        const asciiLetter = TitleFont[char] || TitleFont[" "];

        for (let y = 0; y < lines.length; y++) {
            const row = asciiLetter[y] ?? " ";

            for (let x = 0; x < row.length; x++) {
                lines[y] += row[x];
            }

            // space between letters
            lines[y] += " ";
        }
    }

    return lines;
}
