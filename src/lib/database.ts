import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../punishments.db');
const db = new Database(dbPath);

// initialize database table!
db.exec(`
  CREATE TABLE IF NOT EXISTS punishments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    staff_id TEXT NOT NULL,
    type TEXT NOT NULL,
    reason TEXT,
    created_at INTEGER NOT NULL,
    expires_at INTEGER,
    active INTEGER DEFAULT 1
  )
`);

export interface Punishment {
  id: number;
  user_id: string;
  guild_id: string;
  staff_id: string;
  type: 'ban' | 'kick' | 'warn' | 'mute';
  reason: string | null;
  created_at: number;
  expires_at: number | null;
  active: number; // 1 for true, 0 for false
}

export const addPunishment = db.prepare(`
  INSERT INTO punishments (user_id, guild_id, staff_id, type, reason, created_at, expires_at, active)
  VALUES (@user_id, @guild_id, @staff_id, @type, @reason, @created_at, @expires_at, @active)
`);

export const getActivePunishments = db.prepare(`
  SELECT * FROM punishments WHERE active = 1 AND expires_at IS NOT NULL
`);

export const deactivatePunishment = db.prepare(`
  UPDATE punishments SET active = 0 WHERE id = @id
`);

export const getPunishmentsByUser = db.prepare(`
  SELECT * FROM punishments WHERE user_id = @user_id AND guild_id = @guild_id ORDER BY created_at DESC
`);

export default db;
