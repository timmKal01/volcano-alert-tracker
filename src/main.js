import { Actor, log } from 'apify';
import { fetchElevatedVolcanoes } from './usgs.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const { observatory, minAlertLevel = 'ADVISORY', maxResults = 25 } = input;

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const STATUS_CHECK_EVENT = 'volcano-status-check';

const volcanoes = await fetchElevatedVolcanoes({
    observatory,
    minAlertLevel,
    maxResults: Math.min(maxResults, 100),
});

for (const volcano of volcanoes) {
    await Actor.pushData(volcano);
}

await Actor.charge({ eventName: STATUS_CHECK_EVENT });

log.info(`Pushed ${volcanoes.length} volcano(es)`);

await Actor.exit();
