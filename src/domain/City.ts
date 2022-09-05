export class City {
  name: string;
  city_id: number;
  coord: { lon: number; lat: number };
  country_code: string;

  constructor(
    name: string,
    city_id: number,
    coord: { lon: number; lat: number },
    country_code: string
  ) {
    this.name = name;
    this.city_id = city_id;
    this.coord = coord;
    this.country_code = country_code;
  }
}
