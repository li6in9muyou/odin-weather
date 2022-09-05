import type { City } from "../domain/City";
import { writable } from "svelte/store";
import type { DataPoint } from "../domain/DataPoint";

export const SveltePort = new (class {
  city = writable<City>(null);
  notifications = writable<string[]>([]);
  data_points = writable<DataPoint[]>([]);
  setCity(city: City) {
    this.city.set(city);
    return city;
  }
  setDataPoints(data_points: DataPoint[]) {
    this.data_points.set(data_points);
    return data_points;
  }
  send(message: string) {
    this.notifications.update((msg) => [message, ...msg].slice(0, 6));
  }
})();
