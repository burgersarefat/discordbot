import 'dotenv/config';
import { SapphireClient, ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { GUILD_IDS } from './config';

// Set default behavior to overwrite commands
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

// If guild IDs are configured, set them as default for all commands
if (GUILD_IDS.length) {
    ApplicationCommandRegistries.setDefaultGuildIds(GUILD_IDS);
}

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    loadMessageCommandListeners: true,
    // Explicitly set the base directory to ensure commands are found
    baseUserDirectory: __dirname
});

client.once('clientReady', (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    console.log(`Commands will be registered ${GUILD_IDS.length ? `to guilds: ${GUILD_IDS.join(', ')}` : 'globally'}.`);
});

client.login(process.env.DISCORD_TOKEN);
