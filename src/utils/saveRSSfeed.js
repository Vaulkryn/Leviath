import fs from 'fs';

const dataFilePath = './src/config/rssFeeds.json';

export function saveRSSFeed(url, channelId) {
    try {
        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, JSON.stringify({}), 'utf8');
        }

        let data = {};

        try {
            const fileContent = fs.readFileSync(dataFilePath, 'utf8');
            data = fileContent ? JSON.parse(fileContent) : {};
        } catch (error) {
            console.warn('Fichier JSON corrompu ou vide, réinitialisation...');
            data = {};
        }

        data[channelId] = url;
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 4), 'utf8');
        console.log(`RSS Feeds Saved\n[${url}] -> ${channelId}`);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du flux RSS:', error);
    }
}

export function getRSSFeeds() {
    try {
        if (!fs.existsSync(dataFilePath)) {
            return {};
        }
        return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    } catch (error) {
        console.error('Erreur lors de la lecture des flux RSS:', error);
        return {};
    }
}