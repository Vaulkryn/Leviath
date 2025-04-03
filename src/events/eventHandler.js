import { Events } from 'discord.js';
import { dynamicVoiceChannel } from './dynamicVoiceChannel.js';
import { autoRole } from './autoRole.js';

export default function eventHandler(client) {
    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        dynamicVoiceChannel(oldState, newState);
    });
    const roleId = '1357248674354167929';
    autoRole(client, roleId);
}