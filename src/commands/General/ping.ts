import { Command } from '@sapphire/framework';

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'ping',
      description: 'Ping bot to see if it is alive'
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('ping').setDescription('Ping bot to see if it is alive')
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const msg = await interaction.reply({ content: 'ping?', fetchReply: true });

    const diff = msg.createdTimestamp - interaction.createdTimestamp;
    const ping = Math.round(this.container.client.ws.ping);

    return interaction.editReply(`pong! bot latency: ${ping}ms. api latency: ${diff}ms.`);
  }
}
