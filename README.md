<p align="center">
  <img src="https://i.imgur.com/fQn9zNL.png" alt="Warframe Bot" width="200"/>
</p>

# Warframe Discord Bot

A lightweight and modular Discord bot for tracking world states, Nightwave, Baro Ki'Teer, void fissures, and Warframe Market prices. Built with `discord.js` and TypeScript.

## Features

- **World Cycle Tracking**: Automatically posts Cetus, Cambion Drift, and Orb Vallis cycles on a timer.
- **Nightwave Alerts**: Shows daily and weekly acts.
- **Baro Ki'Teer Status**: Displays current location and inventory.
- **Void Fissures**: Lists all active fissures.
- **Market Lookups**: Finds the cheapest current in-game sell order for any item on [warframe.market](https://warframe.market).
- **Clan Prize Draw**: Restricted command for founding warlord to post prize draws.
- **Usage Command**: Provides interactive help message.

## Commands

Use the prefix `!wf` before all commands:

| Command                    | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `!wf` or `!wf help`        | Show usage instructions                                                     |
| `!wf world` / `!wf cycles` | Show current world cycles (Cetus, Cambion Drift, Orb Vallis)                |
| `!wf baro`                 | Show Baro Ki'Teer's current location and inventory                          |
| `!wf nightwave`           | Display Nightwave dailies and weeklies                                      |
| `!wf fissures`            | List active Void Fissures                                                    |
| `!wf buy <item>`          | Get the cheapest sell order for an item from warframe.market (e.g. `frost prime set`) |
| `!wf prizedraw`           | Post a clan prize draw (restricted to founding warlord only)                |

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/warframe-discord-bot.git
cd warframe-discord-bot
````

### 2. Install dependencies

```bash
npm install
```

### 3. Environment configuration

Create a `.env` file in the root:

```env
DISCORD_AUTH_TOKEN=your_discord_token
DISCORD_PREFIX=!wf
FOUNDING_WARLORD_USER_ID=your_user_id
CLAN_ANNOUNCEMENTS_CHANNEL=channel_id
WORLD_CYCLE_TRACKING_CHANNEL=channel_id
WARFRAME_MARKET_API=https://api.warframe.market/v2
WARFRAME_API=https://api.warframestat.us/pc
WORLD_CYCLE_UPDATE_INTERVAL_MS=3600000
```

> All channel/user IDs can be obtained in Discord by enabling Developer Mode.

## Running the Bot

```bash
npm run build && npm start
```

Use a process manager like `pm2` for background execution:

```bash
pm2 start dist/index.js --name "wf-bot"
```

## Requirements

* Node.js 18+
* Discord bot token
* Text channels with send/embed permissions

## License

[MIT](LICENSE)

<p align="center">
  <img src="https://i.imgur.com/fQn9zNL.png" alt="Warframe Bot" width="200"/>
</p>