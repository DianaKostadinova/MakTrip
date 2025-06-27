export async function fetchWikipediaSummary(title) {
    // Detect language: Cyrillic = mk, else en
    const lang = /[\u0400-\u04FF]/.test(title) ? 'mk' : 'en';

    // 1. Search Wikipedia
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const bestMatch = searchData?.query?.search?.[0]?.title;
    if (!bestMatch) throw new Error("No matching article");

    
    const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestMatch)}`;
    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();
    const originalText = summaryData.extract || "No summary available.";

   
    if (lang === 'mk') {
        const translated = await translateToEnglish(originalText);
        return translated;
    }

    return originalText;
}

async function translateToEnglish(text) {
    const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            q: text,
            source: 'mk',
            target: 'en',
            format: 'text'
        }),
    });

    const data = await res.json();
    return data.translatedText || 'Translation failed';
}
