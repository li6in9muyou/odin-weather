import type { DataPoint } from "../domain/DataPoint";
import { City } from "../domain/City";
import { extractDataPoints } from "./helpers";

export const WEATHER_CLIENT = new (class {
  api_key = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;
  constructor() {
    console.log("weather client is using api key: ", this.api_key);
  }

  async fetch(city_id: number): Promise<DataPoint[]> {
    const tgt = new URL(
      import.meta.env.VITE_OPEN_WEATHER_MAP_WEATHER_FORECAST_API_BASE
    );
    tgt.searchParams.append(
      "appid",
      import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY
    );
    tgt.searchParams.append("id", String(city_id));
    tgt.searchParams.append("units", "metric");
    tgt.searchParams.append("lang", "zh_cn");
    const resp = await fetch(tgt.toString());
    const d = await resp.json();
    return extractDataPoints(d);
  }

  async query(city_name: string): Promise<null | City> {
    const tgt = new URL(
      import.meta.env.VITE_OPEN_WEATHER_MAP_CURRENT_WEATHER_API_BASE
    );
    tgt.searchParams.append(
      "appid",
      import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY
    );
    tgt.searchParams.append("q", city_name);
    const resp = await fetch(tgt.toString());
    if (resp.status === 404) {
      throw { cause: "city not found", tip: "check your spelling" };
    }
    const d = await resp.json();
    return new City(d.name, d.id, d.coord, d.sys.country);
  }
})();
