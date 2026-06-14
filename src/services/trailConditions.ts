export type ConditionReading = {
  wetness: number;
  label: string;
  summary: string;
  source: string;
  updatedAt: string;
  rain24h: number;
  rain72h: number;
};

type OpenMeteoResponse = {
  hourly?: {
    time?: string[];
    precipitation?: number[];
  };
};

const trailPoint = {
  name: 'Muscogee trail corridor',
  latitude: 30.602,
  longitude: -87.355,
};

const airportPoint = {
  name: 'Pensacola airport',
  latitude: 30.4734,
  longitude: -87.1866,
};

function sumRecentRain(times: string[], precipitation: number[], hours: number) {
  const cutoff = Date.now() - hours * 60 * 60 * 1000;

  return times.reduce((total, time, index) => {
    const timestamp = new Date(time).getTime();
    if (Number.isNaN(timestamp) || timestamp < cutoff) return total;
    return total + (precipitation[index] ?? 0);
  }, 0);
}

function classifyWetness(rain24h: number, rain72h: number) {
  const olderRain = Math.max(0, rain72h - rain24h);
  const wetness = Math.max(0, Math.min(100, Math.round(rain24h * 32 + olderRain * 4)));

  if (wetness >= 78) {
    return {
      wetness,
      label: 'Very wet',
      summary: 'Recent rain suggests soft tread. Let the trail dry before riding.',
    };
  }

  if (wetness >= 52) {
    return {
      wetness,
      label: 'Damp',
      summary: 'Expect wet spots and use judgment on low areas and fresh work.',
    };
  }

  if (wetness >= 26) {
    return {
      wetness,
      label: 'Tacky',
      summary: 'Likely rideable with some moisture in shaded or low sections.',
    };
  }

  return {
    wetness,
    label: 'Dry',
    summary: 'Recent rainfall is low. Conditions are likely firm and fast.',
  };
}

async function fetchPoint(point: typeof trailPoint): Promise<ConditionReading> {
  const params = new URLSearchParams({
    latitude: String(point.latitude),
    longitude: String(point.longitude),
    hourly: 'precipitation',
    past_days: '3',
    forecast_days: '1',
    timezone: 'America/Chicago',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Open-Meteo returned ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;
  const times = data.hourly?.time ?? [];
  const precipitation = data.hourly?.precipitation ?? [];

  if (!times.length || !precipitation.length) {
    throw new Error('Open-Meteo response did not include hourly precipitation.');
  }

  const rain24h = sumRecentRain(times, precipitation, 24);
  const rain72h = sumRecentRain(times, precipitation, 72);
  const classified = classifyWetness(rain24h, rain72h);

  return {
    ...classified,
    source: point.name,
    updatedAt: new Date().toISOString(),
    rain24h,
    rain72h,
  };
}

export async function getTrailConditionReading() {
  try {
    return await fetchPoint(trailPoint);
  } catch {
    return fetchPoint(airportPoint);
  }
}
