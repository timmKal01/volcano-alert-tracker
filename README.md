# Volcano Alert Tracker: USGS Elevated Volcanoes

Every U.S. volcano currently at an elevated alert level, for aviation and
flight operations, disaster preparedness and insurance teams, and geology
researchers. One run returns the official USGS status of each restless
volcano, including the aviation color code used for ash warnings.

## What you get

One row per elevated volcano:

- Volcano name and number
- Alert level (Advisory, Watch, Warning) and aviation color code (Yellow, Orange, Red)
- The observatory monitoring it
- When the latest notice was issued, with a link to it

## Who this is for

- **Aviation and flight operations teams**: volcanic ash is a flight safety hazard.
- **Disaster preparedness and insurance teams** watching volcanoes near people and property.
- **Geology researchers and educators** following current volcanic activity.

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

- [Earthquake Tracker](https://apify.com/m_ctim/earthquake-alert): the seismic counterpart, also USGS
