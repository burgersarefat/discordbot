import { Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord.js';
import { addPunishment } from '../../lib/database';
import { parseDuration } from '../../lib/utils';

export class MuteCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'mute',
      description: 'Timeout (mute) a user',
      requiredClientPermissions: [PermissionFlagsBits.ModerateMembers],
      requiredUserPermissions: [PermissionFlagsBits.ModerateMembers]
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('mute')
        .setDescription('Timeout a user')
        .addUserOption((option) => option.setName('user').setDescription('The user to mute').setRequired(true))
        .addStringOption((option) => option.setName('duration').setDescription('Duration (e.g. 10m, 1h)').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('Reason for the mute'))
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true);
    const durationStr = interaction.options.getString('duration', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild?.members.fetch(user.id).catch(() => null);

    if (!interaction.guild) return interaction.reply('This command must be used in a guild.');
    if (!member) return interaction.reply('User is not in this server.');

    if (!member.moderatable) {
      return interaction.reply({ content: 'I cannot mute this user.', ephemeral: true });
    }

    const duration = parseDuration(durationStr);
    if (!duration || duration > 28 * 24 * 60 * 60 * 1000) { // Discord limit is 28 days
      return interaction.reply({ content: 'Invalid duration. The maximum duration is 28 days.', ephemeral: true });
    }

    try {
      await member.timeout(duration, reason);
      
      addPunishment.run({
        user_id: user.id,
        guild_id: interaction.guild.id,
        staff_id: interaction.user.id,
        type: 'mute',
        reason,
        created_at: Date.now(),
        expires_at: Date.now() + duration,
        active: 1
      });

      return interaction.reply(`Successfully muted ${user.tag} for ${durationStr}. Reason: ${reason}`);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Failed to mute user.', ephemeral: true });
    }
  }
}
