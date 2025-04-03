import { Events } from 'discord.js';

export function autoRole(client, roleId) {
    client.on(Events.GuildMemberAdd, async (member) => {
        try {
            const role = member.guild.roles.cache.get(roleId);
            if (!role) {
                console.error(`Role with ID ${roleId} not found.`);
                return;
            }
            await member.roles.add(role);
            console.log(`Role "${role.name}" assigned to ${member.user.tag}`);
        } catch (error) {
            console.error(`Failed to assign role: ${error.message}`);
        }
    });
}