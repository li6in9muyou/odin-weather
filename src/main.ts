import "./app.css";
import App from "./App.svelte";
import { SetInterestedCity } from "./usecase/SetInterestedCity";
import { FetchWeatherDataPoint } from "./usecase/FetchWeatherDataPoint";
import { WEATHER_CLIENT } from "./utility/WeatherClient";
import { SveltePort } from "./port/SveltePort";
import { SendNotification } from "./usecase/SendNotification";

const notify = new SendNotification(SveltePort);
const app = new App({
  target: document.getElementById("app"),
  props: {
    set_city_use_case: new SetInterestedCity(
      new FetchWeatherDataPoint(
        WEATHER_CLIENT,
        { set: SveltePort.setDataPoints.bind(SveltePort) },
        notify
      ),
      WEATHER_CLIENT,
      { set: SveltePort.setCity.bind(SveltePort) },
      notify
    ),
  },
});

export default app;
