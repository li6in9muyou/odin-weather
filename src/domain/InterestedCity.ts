import type { City } from "./City";

export class InterestedCity {
  private city: City = null;
  set(city: City) {
    this.city = city;
  }
  get(): City {
    return this.city;
  }
}
