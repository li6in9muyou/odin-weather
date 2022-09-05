import type { DataPoint } from "../domain/DataPoint";
import type { City } from "../domain/City";

export class FetchWeatherDataPoint {
  private port: { set: (val) => void };
  private client: { fetch: (number) => Promise<DataPoint[]> };
  private notify: { send: (string) => void };

  constructor(
    client: { fetch: (city_id: number) => Promise<DataPoint[]> },
    port: { set: (val) => void },
    notify: { send: (string) => void }
  ) {
    this.client = client;
    this.port = port;
    this.notify = notify;
  }

  private updateStoreWhenMutating(mutator: (val: DataPoint[]) => DataPoint[]) {
    return (args: DataPoint[]) => {
      this.port.set(mutator(args));
    };
  }

  private set_data_points = this.updateStoreWhenMutating((d) => d);

  async fetch(city: City): Promise<void> {
    const data_points = await this.client.fetch(city.city_id);
    if (data_points.length === 0) {
      this.notify.send("no forecast found for this city");
      this.set_data_points([]);
    }
    this.set_data_points(data_points);
  }

  clear() {
    this.set_data_points([]);
  }
}
