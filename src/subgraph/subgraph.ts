import { createClient, Queries } from "@olympusdao/treasury-subgraph-client";
import { CHAIN_ETHEREUM } from "subgraph/constants";

const client = createClient();

type TokenRecordArray = Exclude<Queries["paginated/tokenRecords"]["response"]["data"], undefined>;
export type TokenRecord = TokenRecordArray[0];

type ProtocolMetricArray = Exclude<Queries["paginated/protocolMetrics"]["response"]["data"], undefined>;
export type ProtocolMetric = ProtocolMetricArray[0];

type TokenSupplyArray = Exclude<Queries["paginated/tokenSupplies"]["response"]["data"], undefined>;
export type TokenSupply = TokenSupplyArray[0];

enum QueryType {
    TOKENS,
    METRICS,
    SUPPLIES,
}

async function queryTokens(startDate: string | null | undefined) {
    const response = await client.query({
        operationName: "paginated/tokenRecords",
        input: { startDate: startDate || "" },
    });

    return response;
}

async function querySupplies(startDate: string | null | undefined) {
    const response = await client.query({
        operationName: "paginated/tokenSupplies",
        input: { startDate: startDate || "" },
    });

    return response;
}

export async function queryProtocolMetrics(startDate: string | null | undefined) {
    const response = await client.query({
        operationName: "paginated/protocolMetrics",
        input: { startDate: startDate || "" },
    });

    return response;
}

export async function getTokensCompleteData(startDate: string | null | undefined) {
    const { data: queryResults } = await queryTokens(startDate);

    if (!queryResults || queryResults.length === 0) return undefined;
    // Sort by date descending (just in case)
    const sortedResults = queryResults.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Get the latest date across all chains
    const ethereumResults = sortedResults.filter(result => result.blockchain === CHAIN_ETHEREUM);
    if (ethereumResults.length == 0) return undefined;

    // Restrict to the latest date
    const latestDateEthereum: Date = new Date(ethereumResults[0].date);
    const completeResults = sortedResults.filter(
        result => new Date(result.date).getTime() <= latestDateEthereum.getTime(),
    );

    return completeResults;
}

export async function getSuppliesCompleteData(startDate: string | null | undefined) {
    const { data: queryResults } = await querySupplies(startDate);

    if (!queryResults || queryResults.length === 0) return undefined;
    // Sort by date descending (just in case)
    const sortedResults = queryResults.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Get the latest date across all chains
    const ethereumResults = sortedResults.filter(result => result.blockchain === CHAIN_ETHEREUM);
    if (ethereumResults.length == 0) return undefined;

    // Restrict to the latest date
    const latestDateEthereum: Date = new Date(ethereumResults[0].date);
    const completeResults = sortedResults.filter(
        result => new Date(result.date).getTime() <= latestDateEthereum.getTime(),
    );

    return completeResults;
}

export async function getProtocolMetricsCompleteData(startDate: string | null | undefined) {
    const { data: queryResults } = await queryProtocolMetrics(startDate);

    if (!queryResults || queryResults.length === 0) return undefined;
    // Sort by date descending (just in case)
    const sortedResults = queryResults.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Restrict to the latest date
    const latestDateEthereum: Date = new Date(sortedResults[0].date);
    const completeResults = sortedResults.filter(
        result => new Date(result.date).getTime() <= latestDateEthereum.getTime(),
    );

    return completeResults;
}

export async function getTokensLatestCompleteData(startDate: string | null | undefined) {
    const completeResults = await getTokensCompleteData(startDate);

    if (!completeResults || completeResults.length === 0) return undefined;

    const latestDate: string = completeResults[0].date;
    const latestData = completeResults.filter(record => record.date === latestDate);

    return latestData;
};

export async function getSuppliesLatestCompleteData(startDate: string | null | undefined) {
    const completeResults = await getSuppliesCompleteData(startDate);

    if (!completeResults || completeResults.length === 0) return undefined;

    const latestDate: string = completeResults[0].date;
    const latestData = completeResults.filter(record => record.date === latestDate);

    return latestData;
};


export async function getProtocolMetricsLatestCompleteData(startDate: string | null | undefined) {
    const completeResults = await getProtocolMetricsCompleteData(startDate);

    if (!completeResults || completeResults.length === 0) return undefined;

    const latestDate: string = completeResults[0].date;
    const latestData = completeResults.filter(record => record.date === latestDate);

    return latestData;
};