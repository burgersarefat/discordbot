# Discord Bot with Sapphire Framework

This is a simple Discord bot using the [Sapphire Framework](https://sapphirejs.dev/).

## Prerequisites

- Node.js (v16.6.0 or higher)
- npm or yarn
- A Discord account and a created Application

## Setup Guide

### 1. Create a Discord Bot Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** in the top right.
3. Name your application and click **Create**.
4. Navigate to the **Bot** tab on the left menu.
5. Click **Add Bot** and confirm.
6. Under the **Token** section, click **Reset Token** (or **Copy** if visible) to get your bot token. **Keep this secret!**
7. Scroll down to **Privileged Gateway Intents** and enable **Message Content Intent**, **Server Members Intent**, and **Presence Intent** if you plan to use features requiring them (not strictly needed for just `/ping` but good practice).

### 2. Configure the Bot

1. Clone or download this repository.
2. Create a `.env` file in the root directory.
3. Add your bot token to the `.env` file like this:

   ```env
   DISCORD_TOKEN=your_token_here
   ```

### 3. Install Dependencies

Run the following command in your terminal:

```bash
npm install
```

### 4. Build and Run

To run the bot in development mode:

```bash
npm run dev
```

(Note: You may need to add `"dev": "ts-node src/index.ts"` to your `package.json` scripts if not present).

To build and run for production:

```bash
npm run build
npm start
```

(Note: Add `"build": "tsc"` and `"start": "node dist/index.js"` to `package.json` scripts).

### 5. Invite the Bot to Your Server

1. Go back to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select your application.
3. Go to the **OAuth2** tab -> **URL Generator**.
4. Under **Scopes**, check `bot` and `applications.commands`.
5. Under **Bot Permissions**, check `Send Messages` (and any other permissions you need).
6. Copy the **Generated URL** at the bottom.
7. Paste the URL into your browser, select your server, and click **Authorize**.

## Usage

Once the bot is online, go to your Discord server and type:

```
/ping
```

The bot should reply with "ping".
