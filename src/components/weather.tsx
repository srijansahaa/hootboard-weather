import {
  CloudRain,
  RainbowCloud,
  SunHorizon,
  Thermometer,
  Wind,
} from "@phosphor-icons/react";
import React from "react";
import { PlaceItem, WeatherItem } from "../interfaces";

interface WeatherProps {
  weatherData: WeatherItem;
  placeData: PlaceItem;
}

const Weather: React.FC<WeatherProps> = ({ weatherData, placeData }) => {
  const convertToCelsius = (temp: number): number => {
    return Math.round(temp - 273.15);
  };

  const convertUtcTimestampToTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (inputDateTime: string | number | Date) => {
    const dateObject = new Date(inputDateTime);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    }).format(dateObject);

    return formattedDate;
  };

  return (
    <>
      <div className="flex max-sm:flex-col max-w-screen-md w-full gap-4">
        <div className="w-2/5 max-sm:w-full flex flex-col items-center justify-center gap-3 border rounded-md border bg-gradient-to-br from-sky-500 to-indigo-500 py-4 text-white">
          <img
            alt={weatherData.weather[0].description}
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            className="w-1/2"
          />
          <span className="text-sm font-medium">
            <b className="text-6xl">
              {convertToCelsius(weatherData.main.temp)}
            </b>{" "}
            °C
          </span>
          <p className="capitalize">{`${weatherData.weather[0].main}, ${weatherData.weather[0].description}`}</p>
        </div>
        <div className="w-3/5 max-sm:w-full">
          <div className="mb-2">
            <p className="text-slate-400">
              {formatDate(weatherData.dt_txt)}
            </p>
          </div>
          <div className="grid gap-2 grid-cols-2">
            <div className="flex justify-between items-center border rounded-md bg-white p-8 max-sm:p-4">
              <div className="flex flex-col">
                <label className="text-xs text-slate-400">Feels Like</label>
                <span className="text-2xl">
                  {convertToCelsius(weatherData.main.feels_like)} °C
                </span>
              </div>
              <Thermometer size={32} color="#6287f9" weight="duotone" />
            </div>
            <div className="flex justify-between items-center border rounded-md bg-white p-8 max-sm:p-4">
              <div className="flex flex-col">
                <label className="text-xs text-slate-400">Wind</label>
                <span className="text-2xl">{weatherData.wind.speed} m/s</span>
              </div>
              <Wind size={32} color="#6287f9" weight="duotone" />
            </div>
            <div className="flex justify-between items-center border rounded-md bg-white p-8 max-sm:p-4">
              <div className="flex flex-col">
                <label className="text-xs text-slate-400">Humidity</label>
                <span className="text-2xl">{weatherData.main.humidity} %</span>
              </div>
              <Wind size={32} color="#6287f9" weight="duotone" />
            </div>
            {weatherData?.rain && (
              <div className="flex justify-between items-center border rounded-md bg-white p-8 max-sm:p-4">
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400">Rain</label>
                  <span className="text-2xl">
                    {weatherData?.rain?.["3h"]} mm
                  </span>
                </div>
                <CloudRain size={32} color="#6287f9" weight="duotone" />
              </div>
            )}

            <div className="flex justify-between items-center border rounded-md bg-white p-8 max-sm:p-4">
              <div className="flex flex-col">
                <label className="text-xs text-slate-400">Sunrise</label>
                <span className="text-2xl">
                  {convertUtcTimestampToTime(placeData.sunrise)}
                </span>
              </div>
              <SunHorizon size={32} color="#6287f9" weight="duotone" />
            </div>
            <div className="flex justify-between items-center border rounded-md bg-white p-8 max-sm:p-4">
              <div className="flex flex-col">
                <label className="text-xs text-slate-400">Sunset</label>
                <span className="text-2xl">
                  {convertUtcTimestampToTime(placeData.sunset)}
                </span>
              </div>
              <RainbowCloud size={32} color="#6287f9" weight="duotone" />
            </div>
          </div>
        </div>
      </div>
      <hr className="w-full max-w-screen-md border-t-2 bg-slate-700 last:hidden" />
    </>
  );
};

export default Weather;
