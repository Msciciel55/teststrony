function numberToWords(num) {
    const units = [
        "", "jeden", "dwa", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć",
        "dziesięć", "jedenaście", "dwanaście", "trzynaście", "czternaście", "piętnaście",
        "szesnaście", "siedemnaście", "osiemnaście", "dziewiętnaście"
    ];

    const tens = [
        "", "", "dwadzieścia", "trzydzieści", "czterdzieści", "pięćdziesiąt",
        "sześćdziesiąt", "siedemdziesiąt", "osiemdziesiąt", "dziewięćdziesiąt"
    ];

    const hundreds = [
        "", "sto", "dwieście", "trzysta", "czterysta", "pięćset", "sześćset",
        "siedemset", "osiemset", "dziewięćset"
    ];

    const thousands = [
        "", "tysiąc", "dwa tysiące", "trzy tysiące", "cztery tysiące", "pięć tysięcy",
        "sześć tysięcy", "siedem tysięcy", "osiem tysięcy", "dziewięć tysięcy"
    ];

    if (num === 0) return "zero";

    let words = "";

    // Obsługuje tysiące
    if (Math.floor(num / 1000) > 0) {
        words += thousands[Math.floor(num / 1000)] + " ";
        num %= 1000;
    }

    // Obsługuje setki
    if (Math.floor(num / 100) > 0) {
        words += hundreds[Math.floor(num / 100)] + " ";
        num %= 100;
    }

    // Obsługuje dziesiątki
    if (num > 19) {
        words += tens[Math.floor(num / 10)] + " ";
        num %= 10;
    }

    // Obsługuje jednostki
    if (num > 0) {
        words += units[num] + " ";
    }

    return words.trim();
}