const URL_ENDPOINT = 'https://volcanoes.usgs.gov/hans-public/api/volcano/getElevatedVolcanoes';

const ALERT_LEVEL_RANK = { NORMAL: 0, ADVISORY: 1, WATCH: 2, WARNING: 3 };

const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 4;
const REQUEST_TIMEOUT_MS = 15_000;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url) {
    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        let res;
        try {
            res = await fetch(url, { headers: { Connection: 'close' }, signal: controller.signal });
        } catch (err) {
            lastError = err.name === 'AbortError' ? new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms: ${url}`) : err;
            if (attempt < MAX_ATTEMPTS) {
                await sleep(1000 * 2 ** (attempt - 1));
                continue;
            }
            throw lastError;
        } finally {
            clearTimeout(timeoutId);
        }
        if (res.ok) return res;
        if (!TRANSIENT_STATUSES.has(res.status)) {
            throw new Error(`USGS Volcano API request failed: ${res.status} ${res.statusText}`);
        }
        lastError = new Error(`USGS Volcano API request failed: ${res.status} ${res.statusText}`);
        if (attempt < MAX_ATTEMPTS) await sleep(1000 * 2 ** (attempt - 1));
    }
    throw lastError;
}

export async function fetchElevatedVolcanoes({ observatory, minAlertLevel, maxResults }) {
    const res = await fetchWithRetry(URL_ENDPOINT);
    const volcanoes = await res.json();

    const minRank = ALERT_LEVEL_RANK[minAlertLevel] ?? ALERT_LEVEL_RANK.ADVISORY;

    return volcanoes
        .filter((v) => !observatory || v.obs_abbr?.toLowerCase() === observatory.toLowerCase())
        .filter((v) => (ALERT_LEVEL_RANK[v.alert_level] ?? 0) >= minRank)
        .slice(0, maxResults)
        .map((v) => ({
            volcanoName: v.volcano_name,
            volcanoNumber: v.vnum,
            observatory: v.obs_fullname,
            observatoryAbbr: v.obs_abbr,
            alertLevel: v.alert_level,
            aviationColorCode: v.color_code,
            noticeIssued: v.sent_utc,
            noticeUrl: v.notice_url,
        }));
}
