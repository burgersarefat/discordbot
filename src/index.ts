import 'dotenv/config';
import { SapphireClient, ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { GUILD_IDS } from './config';
import { startPunishmentManager } from './lib/punishmentManager';

// overwrite commands by default
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

if (GUILD_IDS.length) {
    ApplicationCommandRegistries.setDefaultGuildIds(GUILD_IDS);
}

const client = new SapphireClient({
    // make sure to enable "Server Members Intent" and "Message Content Intent" in the discord developer portal!
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    loadMessageCommandListeners: true,
    // set base dir for command loading
    baseUserDirectory: __dirname
});

client.once('clientReady', (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    console.log(`Commands will be registered ${GUILD_IDS.length ? `to guilds: ${GUILD_IDS.join(', ')}` : 'globally'}.`);
    
    // start checking for expired punishments!
    startPunishmentManager(c as SapphireClient);
});

client.login(process.env.DISCORD_TOKEN);
