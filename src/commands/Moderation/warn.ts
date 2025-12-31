import { Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord.js';
import { addPunishment } from '../../lib/database';

export class WarnCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'warn',
      description: 'Warn a user',
      requiredUserPermissions: [PermissionFlagsBits.ModerateMembers]
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption((option) => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('Reason for the warning').setRequired(true))
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason', true);

    if (!interaction.guild) return interaction.reply('This command must be used in a guild.');

    try {
      addPunishment.run({
        user_id: user.id,
        guild_id: interaction.guild.id,
        staff_id: interaction.user.id,
        type: 'warn',
        reason,
        created_at: Date.now(),
        expires_at: null,
        active: 1
      });

      // try to dm user!
      try {
        await user.send(`You were warned in ${interaction.guild.name} for: ${reason}`);
      } catch {
        // ignore if dms closed
      }

      return interaction.reply(`Successfully warned ${user.tag}. Reason: ${reason}`);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Failed to warn user.', ephemeral: true });
    }
  }
}
