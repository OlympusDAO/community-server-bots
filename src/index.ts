import { Client, GatewayIntentBits, GuildMember } from "discord.js";
import { createClient } from "@olympusdao/treasury-subgraph-client";
import { ProtocolMetric, MetricData, updateProtocolMetrics } from "metrics";

// Wundergraph API Client
const client = createClient();

// Initialize protocol metrics
const metrics: Map<string, MetricData> = new Map<string, MetricData>();

// Cache bot servers
let indexBotCache: GuildMember[] = [];
let ohmPriceBotCache: GuildMember[] = [];
let gohmPriceBotCache: GuildMember[] = [];
let marketCapBotCache: GuildMember[] = [];
let liquidBackingBotCache: GuildMember[] = [];

// Index Bot
const indexBot = new Client({ intents: [GatewayIntentBits.Guilds] });

indexBot.on('ready', () => {
    console.log(`Logged in as ${indexBot.user!.tag}!`);
    indexBot.user?.setActivity(`OHM Index`);

    indexBot.guilds.cache.each(guild => guild.members.me && indexBotCache.push(guild.members.me));
    setInterval(() => { updateDiscordName(metrics, ProtocolMetric.INDEX) }, 60000);
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
    setInterval(() => { updateDiscordName(metrics, ProtocolMetric.OHM_PRICE) }, 61000);
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
    setInterval(() => { updateDiscordName(metrics, ProtocolMetric.GOHM_PRICE) }, 62000);
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
    setInterval(() => { updateDiscordName(metrics, ProtocolMetric.MARKETCAP) }, 63000);
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
    setInterval(() => { updateDiscordName(metrics, ProtocolMetric.LIQUID_BACKING) }, 64000);
});

liquidBackingBot.on('guildCreate', guild => {
    liquidBackingBot.guilds.cache.each(guild => guild.members.me && liquidBackingBotCache.push(guild.members.me));
    console.log(`New server has added the liquidBackingBot! Name: ${guild.name}`);
});

liquidBackingBot.login(process.env.DISCORD_LIQUID_BACKING_BOT_TOKEN);


// Aux Function to update the discord names of the bots
async function updateDiscordName(metricsMap: Map<string, MetricData>, metric: ProtocolMetric) {
    if (!metricsMap.has(metric)) await updateProtocolMetrics(metricsMap);
    if (Date.now() - metricsMap.get(metric)!.updateTime.getTime() >= 60000) await updateProtocolMetrics(metricsMap);

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