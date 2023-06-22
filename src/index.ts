import { Client, GatewayIntentBits, GuildMember } from "discord.js";
import { createClient, Operations, Queries } from "@olympusdao/treasury-subgraph-client";
import { ProtocolMetric, MetricData } from "metrics";

// Wundergraph API Client
const client = createClient({
    baseURL: 'http://127.0.0.1:9991/',
});

// Initialize protocol metrics
const metrics: { [key: string]: ProtocolMetric } = {};

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
    setInterval(fn, frequencyInMilliseconds)
    updateProtocolMetrics(metrics);
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
    updateProtocolMetrics(metrics);
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
    updateProtocolMetrics(metrics);
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
    updateProtocolMetrics(metrics);
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
    updateProtocolMetrics(metrics);
});

liquidBackingBot.on('guildCreate', guild => {
    liquidBackingBot.guilds.cache.each(guild => guild.members.me && liquidBackingBotCache.push(guild.members.me));
    console.log(`New server has added the liquidBackingBot! Name: ${guild.name}`);
});

liquidBackingBot.login(process.env.DISCORD_LIQUID_BACKING_BOT_TOKEN);






export async function updateDiscordName(metricsMap: { [key: string]: MetricData }, metric: ProtocolMetric) {
    if (Date.now() - metricsMap[metric].updateTime.getTime() > 120000) { // data freshness of 2 minutes
        updateProtocolMetrics(metricsMap);
    else {

        }
    }



    indexBotCache.forEach(guild => guild.setNickname(
        `${(currentIndex).toLocaleString('en-us', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`
    ));

    ohmPriceBotCache.forEach(guild => guild.setNickname(
        `$${(ohmPrice).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ));

    gohmPriceBotCache.forEach(guild => guild.setNickname(
        `$${(gohmPrice).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ));

    marketCapBotCache.forEach(guild => guild.setNickname(
        `$${(ohmMarketCap / 1e6).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`
    ));

    liquidBackingBotCache.forEach(guild => guild.setNickname(
        `$${(liquidBackingPerOhmBacked).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ));