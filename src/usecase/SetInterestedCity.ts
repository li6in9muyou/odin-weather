import { InterestedCity } from "../domain/InterestedCity";
import type { City } from "../domain/City";
import type { FetchWeatherDataPoint } from "./FetchWeatherDataPoint";
import type { SendNotification } from "./SendNotification";

export class SetInterestedCity {
  private interested_city: InterestedCity;
  private client: { query: (string) => Promise<City> };
  private port: { set: (City) => City };
  private fetch_weather_use_case: FetchWeatherDataPoint;
  private notify: SendNotification;

  constructor(
    fetch_weather_use_case: FetchWeatherDataPoint,
    weather_client: { query: (string) => Promise<City> },
    port: { set: (City) => City },
    notify: SendNotification
  ) {
    this.fetch_weather_use_case = fetch_weather_use_case;
    this.interested_city = new InterestedCity();
    this.client = weather_client;
    this.port = port;
    this.notify = notify;
  }

  private updateStoreWhenMutating(mutator: (City) => City) {
    return (args: City) => {
      this.port.set(mutator(args));
    };
  }

  private set_interested_city = this.updateStoreWhenMutating((c) => {
    this.interested_city.set(c);
    return c;
  });

  async tryThisCity(city_name: string) {
    let city: City = null;
    try {
      city = await this.client.query(city_name);
    } catch (e) {
      this.notify.send(`${e.cause}, tip: ${e.tip}`);
    }
    if (city !== null) {
      this.set_interested_city(city);
      this.fetch_weather_use_case.clear();
      await this.fetch_weather_use_case.fetch(city);
    }
  }
}
