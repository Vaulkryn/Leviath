import { parseStringPromise } from 'xml2js';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const RSS_FEEDS = path.resolve('./src/config/rssFeeds.json');

export default async function manageRSSfeed(gameURL, channelId) {
    const data = await fs.readFile(RSS_FEEDS, 'utf-8').catch(() => '{}');
    const rssFeeds = JSON.parse(data);

    rssFeeds[channelId] = gameURL;
    await fs.writeFile(RSS_FEEDS, JSON.stringify(rssFeeds, null, 4), 'utf-8');

    const response = await fetch(gameURL);
    const xmlData = await response.text();
    const parsedData = await parseStringPromise(xmlData);
    const items = parsedData.rss.channel[0].item;
    
    if (!items || items.length === 0) return null;
    
    const sortedNewsItems = items.sort((a, b) => {
        const dateA = new Date(a.pubDate[0]);
        const dateB = new Date(b.pubDate[0]);
        return dateB - dateA;
    });
    
    const latest = sortedNewsItems[0];
    console.log('XML Data parsed and saved.');
    
    return {
        title: latest.title[0],
        link: latest.link[0],
        pubDate: latest.pubDate[0],
        description: latest.description ? latest.description[0] : 'Pas de description disponible',
    };
}