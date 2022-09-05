export class DataPoint {
  timestamp: number;
  temperature: number;
  humidity: number;
  description: string;

  constructor(
    timestamp: number,
    temperature: number,
    humidity: number,
    description: string
  ) {
    this.timestamp = timestamp;
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
  }
}
