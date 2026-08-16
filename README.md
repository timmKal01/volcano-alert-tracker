# Volcano Alert Tracker — USGS Elevated Volcanoes

Get all currently elevated-alert-level US volcanoes from the official
USGS Volcano Hazards Program: alert level, aviation color code,
observatory, and a link to the full daily notice.

Built for aviation (volcanic ash is a real flight-safety hazard),
geology researchers, and disaster-preparedness teams who want current
status without checking each observatory's page by hand.

## Input

```json
{
  "observatory": "",
  "minAlertLevel": "ADVISORY",
  "maxResults": 25
}
```

| Field | Type | Description |
|---|---|---|
| `observatory` | string (optional) | Limit to one USGS observatory by abbreviation, e.g. `"avo"` (Alaska), `"hvo"` (Hawaii), `"cvo"` (Cascades), `"yvo"` (Yellowstone), `"nmi"` (Northern Mariana Islands). |
| `minAlertLevel` | string | `"ADVISORY"`, `"WATCH"`, or `"WARNING"`. This actor only ever returns volcanoes above NORMAL; use this to narrow further. Default `"ADVISORY"` (all elevated volcanoes). |
| `maxResults` | number | Max volcanoes to return. Default `25`, max `100`. |

## Output

One record per volcano currently above normal alert status:

```json
{
  "volcanoName": "Great Sitkin",
  "volcanoNumber": "311120",
  "observatory": "Alaska Volcano Observatory",
  "observatoryAbbr": "avo",
  "alertLevel": "WATCH",
  "aviationColorCode": "ORANGE",
  "noticeIssued": "2026-08-15 19:33:58",
  "noticeUrl": "https://volcanoes.usgs.gov/hans-public/notice/DOI-USGS-AVO-2026-08-15T19:32:26+00:00"
}
```

At any given time only a handful of US volcanoes are elevated — a
request that finds none still returns no items but is billed once.

## How it works

Direct calls to the official [USGS Volcano Hazards Program
API](https://volcanoes.usgs.gov/hans-public/api/volcano/getElevatedVolcanoes)
— no proxy, no key, no scraping. Public U.S. government data, updated
as observatories issue new notices (typically daily for active
volcanoes, immediately for status changes).

## Pricing note

Billed per **check**, not per volcano returned — one charge whether the
check returns 0 volcanoes or 100.

## Related products

- [Earthquake Alert](https://github.com/timmKal01/earthquake-alert) — the seismic counterpart, also USGS
