import { SapphireClient } from '@sapphire/framework';
import { getActivePunishments, deactivatePunishment, Punishment } from './database';

export function startPunishmentManager(client: SapphireClient) {
  // check every 60 seconds!
  setInterval(async () => {
    const now = Date.now();
    const active = getActivePunishments.all() as Punishment[];

    for (const punishment of active) {
      if (punishment.expires_at && punishment.expires_at <= now) {
        try {
          const guild = await client.guilds.fetch(punishment.guild_id).catch(() => null);
          if (!guild) continue;

          if (punishment.type === 'ban') {
            await guild.members.unban(punishment.user_id, 'Ban expired automatically');
            console.log(`unbanned user ${punishment.user_id} in guild ${punishment.guild_id}`);
          } else if (punishment.type === 'mute') {
            const member = await guild.members.fetch(punishment.user_id).catch(() => null);
            if (member) {
              await member.timeout(null, 'Mute expired automatically');
              console.log(`unmuted user ${punishment.user_id} in guild ${punishment.guild_id}`);
            }
          }

          // mark as inactive in db!
          deactivatePunishment.run({ id: punishment.id });
        } catch (e) {
          console.error(`failed to undo punishment ${punishment.id}:`, e);
        }
      }
    }
  }, 60 * 1000);
}
