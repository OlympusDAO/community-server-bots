# Olympus Community Server Discord Bots

This repo contains the code that powers the sidebar bots in the Olympus community server.

- The bots track several protocol metrics that are of interest to the community server users, by automatically updating their nickname every 60s.
- The bots are built with [discord.js v14](https://discord.js.org/).
- The protocol metrics calculation is done by using the [Treasury Subgraph](https://github.com/OlympusDAO/treasury-subgraph); an in-house monorepo that leverages [wundergraph](https://wundergraph.com/) to abstract away the burden of having to index multiple subgraphs by aggregating its data and removing the need to work with pagination.

## Adding the bots to your own server

If you want to add these bots to your own server, you simply need to authorize them using the following links (note that the only permission that these bots need is the one that allows them to modify their own nickname):
- [Index bot](https://discord.com/api/oauth2/authorize?client_id=1121680052472533043&permissions=67108864&scope=bot)
- [OHM price bot](https://discord.com/api/oauth2/authorize?client_id=1121678012144943115&permissions=67108864&scope=bot)
- [gOHM price bot](https://discord.com/api/oauth2/authorize?client_id=1121679664113528922&permissions=67108864&scope=bot)
- [OHM Marketcap bot](https://discord.com/api/oauth2/authorize?client_id=1121680335978119318&permissions=67108864&scope=bot)
- [Liquid backing per OHM backed bot](https://discord.com/api/oauth2/authorize?client_id=1121680665377783818&permissions=67108864&scope=bot)

Once you have added the bots to your server, you should make sure that they have the proper roles.
Since bots will only be visible in those channels to which they have access, you should ensure that their role allows them to join the channels where they should be available (note that since they only have permission to update their nickname, their functionalities are limited and they cannot read the messages, nor interact with the users in those channels).

## Creating your own bots

If instead, you would prefer to create your own bots by forking the repo, these are the necessary steps to make them work:

1. Create the application for your bots
   - Each bot will require its own application.
   - [Instructions](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
   - Go to the OAuth2 > URL Generator tab. Select `bot` as the application scope, and give it the `Change Nickname` permission. Follow the auto-generated URL to add the bot to your server.
   - Go to the Bot tab. Generate a token and inform it to its corresponding variable in the `.env` file.
2. Similar to what you would do if using Olympus' bots, now that you have added the bots to your server, you need to give them the proper roles to allow them to be visible in the desired channels.
