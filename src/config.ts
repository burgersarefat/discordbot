export const GUILD_IDS: string[] = process.env.GUILD_IDS
  ? process.env.GUILD_IDS.split(',').map((s) => s.trim()).filter(Boolean)
  : [];