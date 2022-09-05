import type { Exception } from "../domain/Exception";
import { DataPoint } from "../domain/DataPoint";

export const sleep = async (duration = 1000) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
};

export const sleepThenThrow = async (exception: Exception, duration = 500) => {
  await sleep(duration);
  throw exception;
};

export const extractDataPoints = (api_response) =>
  api_response.list.map(
    (item) =>
      new DataPoint(
        item.dt,
        item.main.temp,
        item.main.humidity,
        item.weather[0].description
      )
  );

export const timestampToTimeString = (seconds: number) =>
  new Date(seconds * 1e3).toLocaleString();
