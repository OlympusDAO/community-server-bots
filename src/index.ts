import { createClient, Operations, Queries } from "@olympusdao/treasury-subgraph-client";
import { getMetricsLatestCompleteData, getTokensLatestCompleteData, getSuppliesLatestCompleteData } from "subgraph/subgraph";
import { getLiquidBackingPerOhmBacked, getTreasuryAssetValue, getOhmCirculatingSupply } from "subgraph/helpers";

const client = createClient({
    //baseURL: 'http://127.0.0.1:9991/',
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

        console.log(ohmMarketCap);
    }
}

getProtocolMetrics();