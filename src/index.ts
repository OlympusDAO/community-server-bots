import { REST, Routes, Client, GatewayIntentBits, GuildMember, EmbedBuilder, APIEmbedField } from "discord.js";
import { ProtocolMetric, MetricHistory, updateProtocolMetrics } from "metrics";

// Initialize protocol metrics
const metrics: Map<string, MetricHistory> = new Map<string, MetricHistory>();

// Cache bot servers
let indexBotCache: GuildMember[] = [];
let ohmPriceBotCache: GuildMember[] = [];
let gohmPriceBotCache: GuildMember[] = [];
let marketCapBotCache: GuildMember[] = [];
let liquidBackingBotCache: GuildMember[] = [];

registerSlashCommands();

// Index Bot
const indexBot = new Client({ intents: [GatewayIntentBits.Guilds] });

indexBot.on('ready', () => {
    console.log(`Logged in as ${indexBot.user!.tag}!`);
    indexBot.user?.setActivity(`OHM Index`);

    indexBot.guilds.cache.each(guild => guild.members.me && indexBotCache.push(guild.members.me));
    setInterval(() => { updateDiscordName(metrics, ProtocolMetric.INDEX) }, 300_000);
});

indexBot.on('guildCreate', guild => {
    indexBot.guilds.cache.each(guild => guild.members.me && indexBotCache.push(guild.members.me));
    console.log(`New server has added the indexBot! Name: ${guild.name}`);
});

indexBot.login(process.env.DISCORD_INDEX_BOT_TOKEN);

// OHM Price Bot
const ohmPriceBot = new Client({ intents: [GatewayIntentBits.Guilds] });

ohmPriceBot.on('ready', () => {
    console.log(`Logged in as ${ohmPriceBot.user!.tag}!`);
    ohmPriceBot.user?.setActivity(`OHM Price`);

    ohmPriceBot.guilds.cache.each(guild => guild.members.me && ohmPriceBotCache.push(guild.members.me));
    setInterval(() => { updateDiscordName(metrics, ProtocolMetric.OHM_PRICE) }, 310_000);
});

ohmPriceBot.on('guildCreate', guild => {
    ohmPriceBot.guilds.cache.each(guild => guild.members.me && ohmPriceBotCache.push(guild.members.me));
    console.log(`New server has added the ohmPriceBot! Name: ${guild.name}`);
});

ohmPriceBot.login(process.env.DISCORD_OHM_PRICE_BOT_TOKEN);

// gOHM Price Bot
const gohmPriceBot = new Client({ intents: [GatewayIntentBits.Guilds] });

gohmPriceBot.on('ready', () => {
    console.log(`Logged in as ${gohmPriceBot.user!.tag}!`);
    gohmPriceBot.user?.setActivity(`gOHM Price`);

    gohmPriceBot.guilds.cache.each(guild => guild.members.me && gohmPriceBotCache.push(guild.members.me));
    setInterval(() => { updateDiscordName(metrics, ProtocolMetric.GOHM_PRICE) }, 320_000);
});

gohmPriceBot.on('guildCreate', guild => {
    gohmPriceBot.guilds.cache.each(guild => guild.members.me && gohmPriceBotCache.push(guild.members.me));
    console.log(`New server has added the gohmPriceBot! Name: ${guild.name}`);
});

gohmPriceBot.login(process.env.DISCORD_GOHM_PRICE_BOT_TOKEN);

// Market Capitalization Bot
const marketCapBot = new Client({ intents: [GatewayIntentBits.Guilds] });

marketCapBot.on('ready', () => {
    console.log(`Logged in as ${marketCapBot.user!.tag}!`);
    marketCapBot.user?.setActivity(`OHM MarketCap`);

    marketCapBot.guilds.cache.each(guild => guild.members.me && marketCapBotCache.push(guild.members.me));
    setInterval(() => { updateDiscordName(metrics, ProtocolMetric.MARKETCAP) }, 330_000);
});

marketCapBot.on('guildCreate', guild => {
    marketCapBot.guilds.cache.each(guild => guild.members.me && marketCapBotCache.push(guild.members.me));
    console.log(`New server has added the marketCapBot! Name: ${guild.name}`);
});

marketCapBot.login(process.env.DISCORD_MARKETCAP_BOT_TOKEN);

// Liquid Backing Bot
const liquidBackingBot = new Client({ intents: [GatewayIntentBits.Guilds] });

liquidBackingBot.on('ready', () => {
    console.log(`Logged in as ${liquidBackingBot.user!.tag}!`);
    liquidBackingBot.user?.setActivity(`OHM LB 7D SMA `);

    liquidBackingBot.guilds.cache.each(guild => guild.members.me && liquidBackingBotCache.push(guild.members.me));
    setInterval(() => { updateDiscordName(metrics, ProtocolMetric.LIQUID_BACKING) }, 340_000);
});

liquidBackingBot.on('guildCreate', guild => {
    liquidBackingBot.guilds.cache.each(guild => guild.members.me && liquidBackingBotCache.push(guild.members.me));
    console.log(`New server has added the liquidBackingBot! Name: ${guild.name}`);
});

liquidBackingBot.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'get-running-lb') {
        await interaction.reply({ embeds: [await createLiqBackingEmbed(metrics)] });
    }
});

liquidBackingBot.login(process.env.DISCORD_LIQUID_BACKING_BOT_TOKEN);


// -- AUX FUNCTIONS ----------------------------------------------------------------------------------------------------

// Register slash commands
async function registerSlashCommands() {
    const commands = [
        {
            name: 'get-running-lb',
            description: 'Returns the liquid backing in each of the last 7 days.',
        },
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_LIQUID_BACKING_BOT_TOKEN!);

    try {
        await rest.put(Routes.applicationCommands(process.env.DISCORD_LIQUID_BACKING_BOT_CLIENT!), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

// Update the discord names of the bots
async function updateDiscordName(metricsMap: Map<string, MetricHistory>, metric: ProtocolMetric) {
    if (!metricsMap.has(metric)) await updateProtocolMetrics(metricsMap);
    if (Date.now() - metricsMap.get(metric)!.updateTime.getTime() >= 300_000) await updateProtocolMetrics(metricsMap);

    switch (metric) {
        case ProtocolMetric.INDEX:
            indexBotCache.forEach(guild => guild.setNickname(
                `${metricsMap.get(ProtocolMetric.INDEX)!.value
                    .toLocaleString('en-us', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`
            ));

        case ProtocolMetric.OHM_PRICE:
            ohmPriceBotCache.forEach(guild => guild.setNickname(
                `$${metricsMap.get(ProtocolMetric.OHM_PRICE)!.value
                    .toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ));

        case ProtocolMetric.GOHM_PRICE:
            gohmPriceBotCache.forEach(guild => guild.setNickname(
                `$${metricsMap.get(ProtocolMetric.GOHM_PRICE)!.value
                    .toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ));

        case ProtocolMetric.MARKETCAP:
            marketCapBotCache.forEach(guild => guild.setNickname(
                `$${(metricsMap.get(ProtocolMetric.MARKETCAP)!.value / 1e6)
                    .toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`
            ));

        case ProtocolMetric.LIQUID_BACKING:
            liquidBackingBotCache.forEach(guild => guild.setNickname(
                `$${metricsMap.get(ProtocolMetric.LIQUID_BACKING)!.value
                    .toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ));
    }
}

// Build the embed with the Liquid Backing MA data points
async function createLiqBackingEmbed(metricsMap: Map<string, MetricHistory>) {
    const liquidBackingPerOhmBacked = metricsMap.get(ProtocolMetric.LIQUID_BACKING);
    if (liquidBackingPerOhmBacked === undefined || liquidBackingPerOhmBacked.history === undefined) {
        await updateDiscordName(metricsMap, ProtocolMetric.LIQUID_BACKING);
    }
    const title = `Liquid Backing 7 day MA: $${liquidBackingPerOhmBacked?.value.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const fields: APIEmbedField[] = [];
    liquidBackingPerOhmBacked?.history.forEach((day) => {
        fields.push({
            name: day.date,
            value: `$${day.value.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        })
    })
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setURL('https://app.olympusdao.finance/#/dashboard?days=7')
        .setDescription('Detailed view of the liquid backing MA. Data points of the last 7 days.')
        .addFields(fields);

    return embed;
}
