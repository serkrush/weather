// utils/temperature.ts
export const kelvinToCelsius = (kelvin: number): number => Math.round(kelvin - 273.15);

export const kelvinToFahrenheit = (kelvin: number): number =>
  Math.round((kelvin - 273.15) * 9 / 5 + 32);