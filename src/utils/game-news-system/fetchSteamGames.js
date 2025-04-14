import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const STEAM_APPLIST = path.resolve('./src/cache/steam_apps.json');
const STEAM_APPLIST_TTL = 24 * 60 * 60 * 1000; // 24h

async function getCachedAppList() {
    try {
        const stats = await fs.stat(STEAM_APPLIST);
        const now = Date.now();
        if (now - stats.mtimeMs < STEAM_APPLIST_TTL) {
            const rawData = await fs.readFile(STEAM_APPLIST, 'utf-8');
            return JSON.parse(rawData);
        }
    } catch (_) {}

    const res = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
    const data = await res.json();
    const apps = data.applist.apps;

    await fs.writeFile(STEAM_APPLIST, JSON.stringify(apps), 'utf-8');
    console.log(`Steam app list cache updated at ${new Date(Date.now()).toLocaleString()}`);
    return apps;
}

export default async function fetchSteamGames(query) {
    const apps = await getCachedAppList();

    if (!query || query.trim() === '') {
        return [{ name: '...', value: '...' }];
    }

    const normalizedQuery = query
        .toLowerCase()
        .replace(/[:\s]+/g, '')
        .trim();
    const exclusionKeywords = ['dedicatedserver', 'dlc', 'pack', 'subscription', 'soundtrack', 'demo', 'beta', 'test'];

    const uniqueApps = Array.from(
        new Map(
            apps.map(app => [app.name.toLowerCase().trim(), app])
        ).values()
    );

    const filtered = uniqueApps
        .filter(app => {
            if (!app.name) return false;
            const normalizedName = app.name
                .toLowerCase()
                .replace(/[:\s]+/g, '')
                .trim();
            return (
                normalizedName.startsWith(normalizedQuery) &&
                !normalizedName.includes('-') &&
                !exclusionKeywords.some(k => normalizedName.includes(k))
            );
        })
        .slice(0, 12);

    return filtered.map(app => ({
        name: app.name.slice(0, 100),
        value: app.name.slice(0, 100)
    }));
}