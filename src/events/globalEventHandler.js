import { Events } from 'discord.js';
import { activeChannels } from './dynamicVoiceChannel.js';

export default function globalEventHandler(client) {
    client.on(Events.VoiceStateUpdate, async () => {
        for (const [channelId, owner] of activeChannels) {
            try {
                const channel = await client.channels.fetch(channelId);
                if (channel && channel.members.size === 0) {
                    await channel.delete();
                    console.log(`Voice channel owned by ${owner} deleted.\n`);
                    activeChannels.delete(channelId);
                }
            } catch (error) {
                console.error(`Error when deleting channel ${channelId}: ${error.message}`);
            }
        }
    });
}