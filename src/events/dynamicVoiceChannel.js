import { getServerConfigByGuildId } from '../../src/utils/serverDataHandler.js';
import { PermissionsBitField } from 'discord.js';

export const activeChannels = new Map();

export async function dynamicVoiceChannel(oldState, newState) {
    const guildId = newState.guild.id;
    const serverConfig = getServerConfigByGuildId(guildId);

    if (!serverConfig || !serverConfig.dynamic_voice_channel) {
        console.error("Invalid server configuration or dynamic_voice_channel not defined.");
        return;
    }

    const dynamicVoiceChannels = Array.isArray(serverConfig.dynamic_voice_channel)
        ? serverConfig.dynamic_voice_channel
        : [serverConfig.dynamic_voice_channel];

    if (dynamicVoiceChannels.includes(newState.channelId) && !dynamicVoiceChannels.includes(oldState.channelId)) {
        try {
            const parentCategory = newState.channel ? newState.channel.parent : null;

            if (parentCategory) {
                const botMember = newState.guild.members.me;
                const permissions = parentCategory.permissionsFor(botMember);

                const missingPermissions = [];
                if (!permissions.has(PermissionsBitField.Flags.ManageChannels)) missingPermissions.push('MANAGE_CHANNELS');
                if (!permissions.has(PermissionsBitField.Flags.MoveMembers)) missingPermissions.push('MOVE_MEMBERS');
                if (!permissions.has(PermissionsBitField.Flags.Connect)) missingPermissions.push('CONNECT');

                if (missingPermissions.length > 0) {
                    console.error(`Missing permissions in category ${parentCategory.name}: ${missingPermissions.join(', ')}`);
                    return;
                }
            }
            const newChannel = await newState.guild.channels.create({
                name: `🚪丨${newState.member.displayName}`,
                type: 2,
                parent: newState.channel ? newState.channel.parentId : null,
            });
            await newState.setChannel(newChannel);
            activeChannels.set(newChannel.id, newState.member.displayName);
            console.log(`Voice channel: ${newChannel.name} created.\n`);
        } catch (error) {
            console.error(`Error creating or managing the new voice channel: ${error.message}`);
        }
    }
}