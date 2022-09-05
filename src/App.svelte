<script lang="ts">
  import { debounce } from "lodash";
  import type { SetInterestedCity } from "./usecase/SetInterestedCity";
  import { SveltePort } from "./port/SveltePort.js";
  import { timestampToTimeString } from "./utility/helpers.js";

  export let set_city_use_case: SetInterestedCity;

  const onCityInput = debounce(
    async () => {
      await set_city_use_case.tryThisCity(partial_city);
    },
    700,
    { trailing: true }
  );

  let partial_city = "";
  let city = SveltePort.city;
  let notifications = SveltePort.notifications;
  let data_points = SveltePort.data_points;
</script>

<div id="container">
  <section id="notification-display">
    <p>Notifications</p>
    <ol>
      {#each $notifications as notification}
        <li><p>{notification}</p></li>
      {/each}
      {#if $notifications.length === 0}
        <p>no notifications yet</p>
      {/if}
    </ol>
  </section>

  <main>
    <label for="city-input">enter city:</label>
    <input
      id="city-input"
      type="text"
      bind:value={partial_city}
      on:input={onCityInput}
      maxlength="20"
    />
    <section id="city">
      {#if $city !== null}
        <p>{$city.name}</p>
        <p>(<span>{$city.coord.lon}</span>, <span>{$city.coord.lat}</span>)</p>
      {:else}
        <p>&nbsp;</p>
      {/if}
    </section>
    <section id="data-points-display">
      <p>Forecasts, 5 days every 3 hours</p>
      {#if $data_points.length > 0}
        <table>
          <thead>
            <tr>
              <th>when</th>
              <th>temperature (&#x2103;)</th>
              <th>humidity</th>
              <th>description</th>
            </tr>
          </thead>
          <tbody>
            {#each $data_points as data_point}
              <tr>
                <td><p>{timestampToTimeString(data_point.timestamp)}</p></td>
                <td><p>{data_point.temperature}</p></td>
                <td><p>{data_point.humidity}</p></td>
                <td><p>{data_point.description}</p></td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </section>
  </main>
</div>

<style>
  #container {
    padding: 2rem;
  }
</style>
