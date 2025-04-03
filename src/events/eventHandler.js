import { Events } from 'discord.js';
import { dynamicVoiceChannel } from './dynamicVoiceChannel.js';

export default function eventHandler(client) {
    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        dynamicVoiceChannel(oldState, newState);
    });
}