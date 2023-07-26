import { createClient, Queries } from "@olympusdao/treasury-subgraph-client";

const client = createClient();

type MetricArray = Exclude<Queries["paginated/metrics"]["response"]["data"], undefined>;
export type Metric = MetricArray[0];

async function queryMetrics(startDate: string | null | undefined, crossChainDataComplete?: boolean) {
    const response = await client.query({
        operationName: "paginated/metrics",
        input: { startDate: startDate || "", crossChainDataComplete: crossChainDataComplete || false },
    });

    return response;
}

export async function getMetricsCompleteData(startDate: string | null | undefined) {
    const { data: queryResults } = await queryMetrics(startDate, true);

    if (!queryResults || queryResults.length === 0) return undefined;

    // Sort by date descending (just in case)
    const sortedResults = queryResults.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Returned records are already restricted to the latest date with complete cross-chain data
    return sortedResults;
}
