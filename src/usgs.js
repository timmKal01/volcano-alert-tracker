const URL_ENDPOINT = 'https://volcanoes.usgs.gov/hans-public/api/volcano/getElevatedVolcanoes';

const ALERT_LEVEL_RANK = { NORMAL: 0, ADVISORY: 1, WATCH: 2, WARNING: 3 };

export async function fetchElevatedVolcanoes({ observatory, minAlertLevel, maxResults }) {
    const res = await fetch(URL_ENDPOINT, { headers: { Connection: 'close' } });
    if (!res.ok) {
        throw new Error(`USGS Volcano API request failed: ${res.status} ${res.statusText}`);
    }
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
