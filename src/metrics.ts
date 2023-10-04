import {
    getMetricsCompleteData,
    Metric
} from "subgraph/subgraph";

export interface MetricData {
    date: string;
    value: number;
}

export interface MetricHistory {
    value: number;
    updateTime: Date;
    history: MetricData[];
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
    startDate.setDate(startDate.getDate() - 6);
    return startDate.toISOString().split('T')[0];
}

function getlast7Dates() {
    const last7: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        let startDate = new Date();
        startDate.setDate(today.getDate() - i);
        last7.push(startDate.toISOString().split('T')[0]);
    }
    return last7
}

function historicalAvg(array: MetricData[]) {
    let sum = 0
    const len = array.length

    if (len === 0) return 0;

    array.forEach((element) => {
        sum += element.value;
    })

    return sum / len;
}

function updateHistory(history: MetricData[], date: string, value: number) {
    if (history[0].date == date) {
        history[0].value = value
    } else {
        history.pop();
        history.unshift({ date: date, value: value });
    }
    return history;
}

function filterLatestMetricData(metricData: Metric[] | undefined): Metric[] {
    if (!metricData || metricData.length === 0) return [];

    const latestDate: string = metricData[0].date;
    const latestData = metricData.filter(record => record.date === latestDate);

    return latestData;
}

export async function updateProtocolMetrics(metricsMap: Map<string, MetricHistory>) {
    const historicMetricData = await getMetricsCompleteData(getStartDate());
    const latestMetricData = filterLatestMetricData(historicMetricData);

    const historyLength = [
        metricsMap.get(ProtocolMetric.INDEX)?.history.length,
        metricsMap.get(ProtocolMetric.OHM_PRICE)?.history.length,
        metricsMap.get(ProtocolMetric.GOHM_PRICE)?.history.length,
        metricsMap.get(ProtocolMetric.MARKETCAP)?.history.length,
        metricsMap.get(ProtocolMetric.LIQUID_BACKING)?.history.length,
    ]

    if (historyLength.some((length) => length === undefined || length < 7)) {

        if (historicMetricData !== undefined) {

            const last7dates = getlast7Dates();
            const indexHistory: MetricData[] = []
            const ohmPriceHistory: MetricData[] = []
            const gohmPriceHistory: MetricData[] = []
            const ohmMarketCapHistory: MetricData[] = []
            const liquidBackingPerOhmBackedHistory: MetricData[] = []

            // Loop over the 3 arrays simultaneously
            last7dates.forEach((date) => {
                const metricData = historicMetricData.filter(record => record.date === date);

                // Check if the corresponding date exists in the other arrays
                if (metricData) {
                    const metricRecord = metricData[0];

                    const index = metricRecord.ohmIndex;
                    const ohmPrice = metricRecord.ohmPrice;
                    const gOhmPrice = metricRecord.gOhmPrice;
                    const liquidBackingPerOhmBacked = metricRecord.treasuryLiquidBackingPerOhmBacked;
                    const marketCap = metricRecord.marketCap;

                    indexHistory.push({
                        date: date,
                        value: index,
                    });
                    ohmPriceHistory.push({
                        date: date,
                        value: ohmPrice,
                    });
                    gohmPriceHistory.push({
                        date: date,
                        value: gOhmPrice,
                    });
                    ohmMarketCapHistory.push({
                        date: date,
                        value: marketCap,
                    });
                    liquidBackingPerOhmBackedHistory.push({
                        date: date,
                        value: liquidBackingPerOhmBacked,
                    });
                }
            });

            metricsMap.set('index', {
                value: indexHistory[0].value,
                updateTime: new Date(),
                history: indexHistory
            });
            metricsMap.set('ohmPrice', {
                value: ohmPriceHistory[0].value,
                updateTime: new Date(),
                history: ohmPriceHistory
            });
            metricsMap.set('gohmPrice', {
                value: gohmPriceHistory[0].value,
                updateTime: new Date(),
                history: gohmPriceHistory
            });
            metricsMap.set('ohmMarketCap', {
                value: ohmMarketCapHistory[0].value,
                updateTime: new Date(),
                history: ohmMarketCapHistory
            });
            metricsMap.set('liquidBackingPerOhmBacked', {
                value: historicalAvg(liquidBackingPerOhmBackedHistory),
                updateTime: new Date(),
                history: liquidBackingPerOhmBackedHistory
            });

            console.log(`Protocol Metrics fetched for the first time! \n ${Date()}`);
        }
    } else {

        if (latestMetricData !== undefined) {
            const latestMetricRecord = latestMetricData[0];

            const date = latestMetricRecord.date;
            const currentIndex = latestMetricRecord.ohmIndex;
            const gohmPrice = latestMetricRecord.gOhmPrice;
            const ohmPrice = latestMetricRecord.ohmPrice;
            const ohmMarketCap = latestMetricRecord.marketCap;
            const historicLiquidBackingPerOhmBacked = latestMetricRecord.treasuryLiquidBackingPerOhmBacked;

            const indexHistory = metricsMap.get(ProtocolMetric.INDEX)?.history!;
            const ohmPriceHistory = metricsMap.get(ProtocolMetric.OHM_PRICE)?.history!;
            const gohmPriceHistory = metricsMap.get(ProtocolMetric.GOHM_PRICE)?.history!;
            const ohmMarketCapHistory = metricsMap.get(ProtocolMetric.MARKETCAP)?.history!;
            const liquidBackingPerOhmBackedHistory = metricsMap.get(ProtocolMetric.LIQUID_BACKING)?.history!;

            metricsMap.set('index', {
                value: currentIndex,
                updateTime: new Date(),
                history: updateHistory(indexHistory, date, currentIndex),
            });

            metricsMap.set('ohmPrice', {
                value: ohmPrice,
                updateTime: new Date(),
                history: updateHistory(ohmPriceHistory, date, ohmPrice),
            });

            metricsMap.set('gohmPrice', {
                value: gohmPrice,
                updateTime: new Date(),
                history: updateHistory(gohmPriceHistory, date, gohmPrice),
            });

            metricsMap.set('ohmMarketCap', {
                value: ohmMarketCap,
                updateTime: new Date(),
                history: updateHistory(ohmMarketCapHistory, date, ohmMarketCap),
            });

            const updatedHistory = updateHistory(liquidBackingPerOhmBackedHistory, date, historicLiquidBackingPerOhmBacked);
            metricsMap.set('liquidBackingPerOhmBacked', {
                value: historicalAvg(updatedHistory),
                updateTime: new Date(),
                history: updatedHistory
            });

            console.log(`Protocol Metrics updated! \n ${Date()}`);
        }
    }
}