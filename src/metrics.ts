import { getMetricsLatestCompleteData, getTokensLatestCompleteData, getSuppliesLatestCompleteData } from "subgraph/subgraph";
import { getLiquidBackingPerOhmBacked, getTreasuryAssetValue, getOhmCirculatingSupply } from "subgraph/helpers";

export interface MetricData {
    value: number;
    updateTime: Date;
}

export enum ProtocolMetric {
    INDEX = 'index',
    OHM_PRICE = 'ohmPrice',
    GOHM_PRICE = 'gohmPrice',
    MARKETCAP = 'ohmMarketCap',
    LIQUID_BACKING = 'liquidBackingPerOhmBacked',
}

// Aux Functions
function getStartDate() {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    return startDate.toISOString().split('T')[0];
}

export async function updateProtocolMetrics(metricsMap: Map<string, MetricData>) {
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

        metricsMap.set('index', {
            value: currentIndex,
            updateTime: new Date(),
        });

        metricsMap.set('ohmPrice', {
            value: ohmPrice,
            updateTime: new Date(),
        });

        metricsMap.set('gohmPrice', {
            value: gohmPrice,
            updateTime: new Date(),
        });

        metricsMap.set('ohmMarketCap', {
            value: ohmMarketCap,
            updateTime: new Date(),
        });

        metricsMap.set('liquidBackingPerOhmBacked', {
            value: liquidBackingPerOhmBacked,
            updateTime: new Date(),
        });

        console.log(`Protocol Metrics updated! \n ${Date()}`);
    }
}