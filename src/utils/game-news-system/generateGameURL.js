import fs from 'fs/promises';
import path from 'path';

const STEAM_APPLIST = path.resolve('./src/cache/steam_apps.json');

export default async function generateGameURL(gameName) {
    try {
        const rawData = await fs.readFile(STEAM_APPLIST, 'utf-8');
        const apps = JSON.parse(rawData);
        const game = apps.find(app => app.name.toLowerCase() === gameName.toLowerCase());

        return `https://store.steampowered.com/feeds/news/app/${game.appid}`;
    } catch (_) {}
}