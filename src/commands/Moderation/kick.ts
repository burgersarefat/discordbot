import { Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord.js';
import { addPunishment } from '../../lib/database';

export class KickCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'kick',
      description: 'Kick a user from the server',
      requiredClientPermissions: [PermissionFlagsBits.KickMembers],
      requiredUserPermissions: [PermissionFlagsBits.KickMembers]
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('kick')
        .setDescription('Kick a user')
        .addUserOption((option) => option.setName('user').setDescription('The user to kick').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('Reason for the kick'))
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild?.members.fetch(user.id).catch(() => null);

    if (!interaction.guild) return interaction.reply('This command must be used in a guild.');
    if (!member) return interaction.reply('User is not in this server.');

    if (!member.kickable) {
      return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });
    }

    try {
      await member.kick(reason);
      
      addPunishment.run({
        user_id: user.id,
        guild_id: interaction.guild.id,
        staff_id: interaction.user.id,
        type: 'kick',
        reason,
        created_at: Date.now(),
        expires_at: null,
        active: 0 // kicks are one-time events
      });

      return interaction.reply(`Successfully kicked ${user.tag}. Reason: ${reason}`);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Failed to kick user.', ephemeral: true });
    }
  }
}
