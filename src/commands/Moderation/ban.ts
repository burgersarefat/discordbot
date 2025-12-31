import { Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord.js';
import { addPunishment } from '../../lib/database';
import { parseDuration } from '../../lib/utils';

export class BanCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'ban',
      description: 'Ban a user from the server',
      requiredClientPermissions: [PermissionFlagsBits.BanMembers],
      requiredUserPermissions: [PermissionFlagsBits.BanMembers]
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption((option) => option.setName('user').setDescription('The user to ban').setRequired(true))
        .addStringOption((option) => option.setName('duration').setDescription('Duration (e.g. 1d, 2h). Leave empty for perm ban.'))
        .addStringOption((option) => option.setName('reason').setDescription('Reason for the ban'))
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true);
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild?.members.fetch(user.id).catch(() => null);

    if (!interaction.guild) return interaction.reply('This command must be used in a guild.');

    // check permissions!
    if (member && !member.bannable) {
      return interaction.reply({ content: 'I cannot ban this user (they might have higher roles).', ephemeral: true });
    }

    const duration = durationStr ? parseDuration(durationStr) : null;
    const expiresAt = duration ? Date.now() + duration : null;

    try {
      await interaction.guild.members.ban(user, { reason });
      
      // log to db!
      addPunishment.run({
        user_id: user.id,
        guild_id: interaction.guild.id,
        staff_id: interaction.user.id,
        type: 'ban',
        reason,
        created_at: Date.now(),
        expires_at: expiresAt,
        active: 1
      });

      const timeInfo = durationStr ? ` for ${durationStr}` : ' permanently';
      return interaction.reply(`Successfully banned ${user.tag}${timeInfo}. Reason: ${reason}`);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Failed to ban user.', ephemeral: true });
    }
  }
}
