import { PermissionsBitField, MessageFlags } from 'discord.js';

export default async function clearMsg(interaction) {
    try {
        const botPermissions = interaction.channel.permissionsFor(interaction.guild.members.me);
        const requiredPermissions = [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.ManageMessages
        ];

        const missingPermissions = requiredPermissions.filter(
            perm => !botPermissions.has(perm)
        );

        if (missingPermissions.length > 0) {
            const missingPermsNames = missingPermissions.map(perm => {
                switch (perm) {
                    case PermissionsBitField.Flags.ViewChannel:
                        return 'Lire les messages (View Channel)';
                    case PermissionsBitField.Flags.ManageMessages:
                        return 'Gérer les messages (Manage Messages)';
                    default:
                        return `Permission inconnue (${perm})`;
                }
            });

            console.error(`Permissions manquantes : ${missingPermsNames.join(', ')}`);
            return interaction.reply({
                content: `Je n'ai pas les permissions nécessaires pour exécuter cette commande : ${missingPermsNames.join(', ')}.`,
                flags: MessageFlags.Ephemeral,
            });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        const messagesToDelete = messages.filter(
            msg => msg.createdAt >= today && msg.createdAt > Date.now() - 14 * 24 * 60 * 60 * 1000 // Moins de 14 jours
        );

        if (messagesToDelete.size === 0) {
            return interaction.reply({
                content: "Aucun message à supprimer pour aujourd'hui.",
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.channel.bulkDelete(messagesToDelete, true);

        return interaction.reply({
            content: `${messagesToDelete.size} message(s) supprimé(s) pour aujourd'hui.`,
            flags: MessageFlags.Ephemeral,
        });
    } catch (error) {
        console.error('Erreur lors de la suppression des messages :', error);
        return interaction.reply({
            content: "Une erreur s'est produite lors de la suppression des messages.",
            flags: MessageFlags.Ephemeral,
        });
    }
}