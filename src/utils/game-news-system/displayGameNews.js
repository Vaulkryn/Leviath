import { EmbedBuilder } from 'discord.js';

const decodeHTMLEntities = (text) => {
    return text.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
};

const cleanHTML = (html) => {
    return decodeHTMLEntities(html) // Décoder les entités HTML
        .replace(/<br\s*\/?>/gi, '\n') // Remplace les <br> par des sauts de ligne
        .replace(/<b[^>]*>(.*?)<\/b>/gi, (_, text) => `**${text.trim()}**`) // Transforme les balises <b> en gras Markdown
        .replace(/<li[^>]*>/gi, '- ') // Convertit les balises <li> en tirets Markdown
        .replace(/<\/li>(?=\s*<b[^>]*>)/gi, '\n') // Ajoute un saut de ligne uniquement si </li> est suivi d'une balise <b>
        .replace(/<\/li>/gi, '') // Supprime les autres </li> sans saut de ligne
        .replace(/<ul[^>]*>/gi, '\n') // Ajoute un saut de ligne avant une liste
        .replace(/<\/ul>/gi, '\n') // Ajoute un saut de ligne après une liste
        .replace(/<span[^>]*>(.*?)<\/span>/gi, (_, text) => text.trim()) // Récupère uniquement le texte des balises <span>
        .replace(/\n{3,}/g, '\n\n') // Limite les sauts de ligne consécutifs à deux
        .replace(/<a\s+[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (_, href) => {
            if (href.includes('store.steampowered.com')) {
                const match = href.match(/\/app\/\d+\/([^\/?#]+)/); // Extraire le nom après "/app/{id}/"
                if (match) {
                    const gameName = match[1].replace(/_/g, ' '); // Remplace les "_" par des espaces
                    return `👉 [${gameName}](${href})`;
                }
                return href;
            }

            if (href.includes('steamcommunity.com/linkfilter')) {
                const decodedUrl = decodeURIComponent(href.split('?u=')[1]);

                if (decodedUrl.includes('discord')) {
                    return `[Discord](${decodedUrl})`;
                }
                if (decodedUrl.includes('newsletter')) {
                    return `[Newsletter](${decodedUrl})`;
                }
                if (decodedUrl.includes('tiktok')) {
                    return `[TikTok](${decodedUrl})`;
                }
                if (decodedUrl.includes('facebook')) {
                    return `[Facebook](${decodedUrl})`;
                }
                if (decodedUrl.includes('twitter')) {
                    return `[X](${decodedUrl})`;
                }
                if (decodedUrl.includes('instagram')) {
                    return `[Instagram](${decodedUrl})`;
                }
                if (decodedUrl.includes('threads')) {
                    return `[Threads](${decodedUrl})`;
                }
                const domainMatch = decodedUrl.match(/https?:\/\/(?:www\.)?([^\/]+)\//);
                const domain = domainMatch ? domainMatch[1].replace(/\.\w+$/, '') : 'URL "steamcommunity.com/linkfilter" non décodé';
                return `[${domain}](${decodedUrl})`;
            }
            const domainMatch = href.match(/https?:\/\/(?:www\.)?([^\/]+)\//);
            if (domainMatch) {
                const domain = domainMatch[1].replace(/\.\w+$/, '');
                return `[${domain}](${href})`;
            }
            return `[URL non décodé](${href})`;
        })
        .replace(/<[^>]+>/g, '') // Supprime toutes les autres balises HTML
        .trim(); // Supprime les espaces inutiles
};

const splitText = (text, maxLength = 2500) => {
    const chunks = [];
    let currentChunk = '';

    for (const line of text.split('\n')) {
        if (currentChunk.length + line.length + 1 > maxLength) {
            chunks.push(currentChunk);
            currentChunk = '';
        }
        currentChunk += (currentChunk ? '\n' : '') + line;
    }

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
};

export default async function displayGameNews(newsData, channel, client) {
    try {
        if (!newsData) {
            console.log('No recent updates.');
            return;
        }

        if (typeof channel === 'string' || typeof channel === 'number') {
            channel = await client.channels.fetch(channel).catch(err => {
                console.error('Error retrieving channel:\n', err);
                return null;
            });
        }

        const rawDescription = newsData.description || 'Description non disponible';
        const mediaRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>|data-youtube="([^"]+)"/gi;
        let match;
        let lastIndex = 0;
        const youtubeUrls = [];

        // Première passe: extraire les URLs YouTube
        while ((match = mediaRegex.exec(rawDescription)) !== null) {
            const youtubeId = match[2];
            if (youtubeId) {
                const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
                youtubeUrls.push(youtubeUrl);
            }
        }
        if (youtubeUrls.length > 0) {
            const youtubeMessage = `${youtubeUrls.join('\n')}`;
            await channel.send(youtubeMessage);
        }

        // Réinitialiser l'index pour une deuxième passe
        mediaRegex.lastIndex = 0;

        let isTitleAdded = false;

        // Deuxième passe: traiter les images et le reste du contenu
        while ((match = mediaRegex.exec(rawDescription)) !== null) {
            const imgSrc = match[1];
            const currentDescription = cleanHTML(rawDescription.slice(lastIndex, match.index));
            lastIndex = mediaRegex.lastIndex;

            if (currentDescription.includes('class="sharedFilePreviewYouTubeVideo')) {
                continue;
            }

            if (imgSrc) {
                const embed = new EmbedBuilder()
                    .setTitle(!isTitleAdded ? `● ${newsData.title || 'Titre non disponible'} ●` : null)
                    .setDescription(currentDescription || 'Description non disponible')
                    .setColor('#6c8aa7')
                    .setImage(imgSrc);

                if (!isTitleAdded && newsData.link) {
                    embed.setURL(newsData.link);
                }

                if (mediaRegex.lastIndex === rawDescription.length) {
                    embed.setTimestamp(new Date(newsData.pubDate));
                }
                await channel.send({ embeds: [embed] });

                isTitleAdded = true;
            }
        }

        const remainingDescription = cleanHTML(rawDescription.slice(lastIndex));
        if (remainingDescription) {
            const descriptionChunks = splitText(remainingDescription);

            for (const [index, chunk] of descriptionChunks.entries()) {
                const embed = new EmbedBuilder()
                    .setTitle(!isTitleAdded && index === 0 ? `● ${newsData.title || 'Titre non disponible'} ●` : null)
                    .setDescription(chunk)
                    .setColor('#6c8aa7');

                if (!isTitleAdded && newsData.link) {
                    embed.setURL(newsData.link);
                }

                if (index === descriptionChunks.length - 1) {
                    embed.setTimestamp(new Date(newsData.pubDate));
                }

                await channel.send({ embeds: [embed] });
            }
        }

        console.log('Game news successfully added.\n');
    } catch (error) {
        console.error('Error sending news:\n', error);
    }
}