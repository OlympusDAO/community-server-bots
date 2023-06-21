import { Client, GatewayIntentBits, GuildMember } from "discord.js";
import { createClient, Operations, Queries } from "@olympusdao/treasury-subgraph-client";
import { getMetricsLatestCompleteData, getTokensLatestCompleteData, getSuppliesLatestCompleteData } from "subgraph/subgraph";
import { getLiquidBackingPerOhmBacked, getTreasuryAssetValue, getOhmCirculatingSupply } from "subgraph/helpers";

let guildMeCache: GuildMember[] = [];

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user!.tag}!`);
    bot.user?.setActivity(`😀`);

    bot.guilds.cache.each(guild => guild.members.me && guildMeCache.push(guild.members.me));
    getProtocolMetrics();
});

// New server join event that causes the guild cache to refresh
bot.on('guildCreate', guild => {
    bot.guilds.cache.each(guild => guild.members.me && guildMeCache.push(guild.members.me));
    console.log(`New server has added the bot! Name: ${guild.name}`);
});

bot.login(process.env.DISCORD_BOT_TOKEN);

const client = createClient({
    baseURL: 'http://127.0.0.1:9991/',
});

function getStartDate() {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    return startDate.toISOString().split('T')[0];
}

async function getProtocolMetrics() {
    const latestTokenData = await getTokensLatestCompleteData(getStartDate());
    const latestSupplyData = await getSuppliesLatestCompleteData(getStartDate());
    const latestMetricData = await getMetricsLatestCompleteData(getStartDate());

    if (latestTokenData !== undefined && latestSupplyData !== undefined && latestMetricData !== undefined) {
        const liquidBacking = getTreasuryAssetValue(latestTokenData, true);
        const currentIndex = Number(latestMetricData[0].currentIndex);
        const gohmPrice = Number(latestMetricData[0].gOhmPrice);
        const ohmPrice = Number(latestMetricData[0].ohmPrice);
        const liquidBackingPerOhmBacked = getLiquidBackingPerOhmBacked(liquidBacking, latestSupplyData, currentIndex)
        const ohmCirculatingSupply = getOhmCirculatingSupply(latestSupplyData, currentIndex)[0]
        const ohmMarketCap = ohmPrice * ohmCirculatingSupply;

        guildMeCache.forEach(guild => guild.setNickname(
            `${(ohmMarketCap / 1e6).toLocaleString('en-us', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}M`
        ));
        bot.user?.setActivity(`OHM MarketCap`);
    }
}