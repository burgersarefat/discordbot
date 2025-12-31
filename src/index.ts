import 'dotenv/config';
import { SapphireClient, ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { GUILD_IDS } from './config';

// overwrite commands by default
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

if (GUILD_IDS.length) {
    ApplicationCommandRegistries.setDefaultGuildIds(GUILD_IDS);
}

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    loadMessageCommandListeners: true,
    // set base dir for command loading
    baseUserDirectory: __dirname
});

client.once('clientReady', (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    console.log(`Commands will be registered ${GUILD_IDS.length ? `to guilds: ${GUILD_IDS.join(', ')}` : 'globally'}.`);
});

client.login(process.env.DISCORD_TOKEN);
