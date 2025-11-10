// JS Stick Letters  https://patorjk.com/software/taag/#p=display&f=JS+Stick+Letters&t=Work&x=none&v=4&h=4&w=80&we=false

export const TitleFont: Record<string, string[]> = {
    A: ["    ", 
        " /\\ ", 
        "/__\\"],
    B: [" __ ",
        "|__)",
        "|__)"],
    C: [" __ ",
        "/  `",
        "\\__,"],
    D: ["__ ",
        "|  \\",
        "|__/"],
    E: [" ___",
        "|__ ",
        "|___"],
    F: [" ___",
        "|__ ",
        "|   "],
    G: [" __  ",
        "/ _` ",
        "\\__>"],
    H: ["     ",
        "|__|",
        "|  |"],
    I: [" ",
        "|",
        "|"],
    J: ["    ",
        "   |",
        "\\__/"],
    K: ["    ",
        "|__/",
        "|  \\"],
    L: ["    ",
        "|   ",
        "|___"],
    M: ["    ",
        "|\\/|",
        "|  |"],
    N: ["     ",
        "|\\ |",
        "| \\|"],
    O: [" __ ",
        "/  \\",
        "\\__/"],
    P: [" __ ",
        "|__)",
        "|   "],
    Q: [" __ ",
        "/  \\",
        "\\__X "],
    R: [" __ ",
        "|__)",
        "|  \\"],
    S: [" __ ",
        "/__`",
        ".__/"],
    T: ["___",
        " | ",
        " | "],
    U: ["    ",
        "|  |",
        "\\__/"],
    V: ["    ",
        "\\  /",
        " \\/ "],
    W: ["    ",
        "|  |",
        "|/\\|"],
    X: ["   ",
        "\\_/",
        "/ \\"],
    Y: ["   ",
        "\\ /",
        " | "],
    Z: ["__",
        " /",
        "/_"],
    " ": ["  ","  ","  "]
};

export function createASCIITitle(title:string): string{
    const lines = ["","",""]

    for(const char of title.toUpperCase()){
        const asciiLetter = TitleFont[char] || TitleFont[" "]

        for (let i = 0; i < lines.length; i++) {
            lines[i] += (asciiLetter[i] ?? " ") + " ";
        }
    }

    return lines.join("\n");
}
