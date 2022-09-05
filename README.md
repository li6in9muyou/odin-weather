# odin-weather-tk2

## Learning Objectives

### Conceptual

By building this project, I plan to learn about how to completely decouple business logic
from frontend frameworks. I am going to follow principles from _Clean Architecture_.

### Technical

- Instead of being written in source, apikey should be imported via ENV variable.
- Apikey should not be picked up by git.
- List and handle at least three exceptions.

## Domain Concepts

### City

The city of user's interest.

### Data Points

For a given city, the key measurements of its weather. It can be measured right now
or forecasted.

### Notification

A notification consists of an importance level and a message.

## UseCases

### FetchWeatherForecast

### ReportFailure

When exception occurs, UI should prompt user with notifications.

### SetInterestedCity

User types in city name then after debounce timeout of 500ms, interested city is set.
Current weather and 5 day forecast of that city is shown to the user.

#### alternatively

If interested city is not found in system database, report to user.

## Notes

### Exceptions

- Bad network: report to user
- No such City: report to user
- City name exceeds length restriction: report to user

## Solved Bugs

### {#each} tag complains parameter is not array-like object

Prepend $ sign to parameter to retrieve value of the store.

### "null" string is shown on the page

I tried give it a default value by appending `?? " "`. This is approach is not good, because
whitespaces are ignored in HTML which causes the surrounding HTML element to collapse.
In the end I chose the following solution.

```HTML
    {#if $city !== null}
      <p>{$city}</p>
    {:else}
      <pre>& nbsp;</pre>
    {/if}
```

### Uncaught: undefined.tryThisCity

Cause: There is no props provided to `App` component.
Solution:

```ts
const app = new App({
  target: document.getElementById("app"),
  props: {
    /* insert props definitions */
  },
});
```

### Uncaught: undefined.query

Cause: Uninitialized field in class SetInterestedCity.
Solution: initialize that field

#### Why did WebCharm fail to alert me of uninitialized fields?

I do not know. Maybe I should turn on strict type checking in tsconfig.json or something.

### Expecting entered city name appears while no logs in console and no visual changes

expected execution path:

1. InputEvent fired
2. tryThisCity called
3. a City object returned from `client.query(city_name)`
4. city store updated

I suspects this problem has something to do with Svelte.
I discovered that: City store is not updated. Async method `tryThisCity` is not awaited.

The true cause is that ill implemented decorator pattern succeed in confusing me.
I did not invoke the decorated function. I change the definition of decorated function from

```ts
function decorated(orig_arg) {
  decorator(orig_function); // this line does nothing!
}
```

to

```ts
const decorated = decorator(original_function);
```

alternatively

```ts
function decorated(orig_arg) {
  return decorator(orig_function)(orig_arg); // this line does nothing!
}
```

### undefined.set

I passed `{set: SveltePort.setCity}` as a parameter into the constructor of `SetInterestedCity` which leads to
undefined "this". Use `bind` to explicitly bind "this" pointer.

```ts
{
  set: SveltePort.setCity.bind(SveltePort);
}
```

Alternatively, use arrow function to capture `SveltePort` in closure so that the "this" pointer of `setCity`
points as expected.

```ts
{
  set: (city) => SveltePort.setCity(city);
}
```

### after http request is successfully made, city name is not updated and ill-formed notification is shown

Apparently, exception is thrown by third party code in `WEATHER_CLIENT.query` method. The problem is that
`await (await fetch()).json()` returns valid js Object instead of JSON text.

> https://developer.mozilla.org/en-US/docs/Web/API/Response/json
>
> Response.json()
>
> The json() method of the Response interface takes a Response stream and reads it to completion. It returns a promise which resolves with the result of parsing the body text as JSON.
>
> Note that despite the method being named json(), the result is not JSON but is instead the result of taking JSON as input and parsing it to produce a JavaScript object.
