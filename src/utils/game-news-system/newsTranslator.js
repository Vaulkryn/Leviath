import axios from 'axios';

export default async function newsTranslator(newsData) {
    const apiKey = process.env.DEEPL_API_KEY;
    const apiUrl = 'https://api-free.deepl.com/v2/translate';

    try {
        const response = await axios.post(apiUrl, null, {
            params: {
                auth_key: apiKey,
                text: newsData.description,
                target_lang: 'FR',
                tag_handling: 'html',
            },
        });

        const translatedText = response.data.translations[0].text;
        console.log('News data translated.');
        return {
            ...newsData,
            description: translatedText,
        };
    } catch (error) {
        console.error('DeepL error:\n', error.message);
        throw new Error('Impossible de traduire la description.');
    }
}