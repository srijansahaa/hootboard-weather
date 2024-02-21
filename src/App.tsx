import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import {
  CloudRain,
  RainbowCloud,
  SunHorizon,
  Thermometer,
  Wind,
} from "@phosphor-icons/react";
import landing from "./assets/landing.png";

interface Coord {
  lon: number;
  lat: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Rain {
  "1h": number;
  "3h": number;
}

interface Clouds {
  all: number;
}

interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

interface WeatherData {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  rain: Rain;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState({});

  const fetchWeatherData = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=832757f844ba393972494e7ba530773f`
      );
      setError("");
      setWeatherData(response.data);
      console.log(response.data);
      if (weatherData) {
        const date = new Date(weatherData.dt * 1000);
        setDate(date);
      }
    } catch (error) {
      setError("Enter a valid search");
    }
  };

  // const weatherData = {
  //   coord: {
  //     lon: 10.99,
  //     lat: 44.34,
  //   },
  //   weather: [
  //     {
  //       id: 501,
  //       main: "Rain",
  //       description: "moderate rain",
  //       icon: "10d",
  //     },
  //   ],
  //   base: "stations",
  //   main: {
  //     temp: 298.48,
  //     feels_like: 298.74,
  //     temp_min: 297.56,
  //     temp_max: 300.05,
  //     pressure: 1015,
  //     humidity: 64,
  //     sea_level: 1015,
  //     grnd_level: 933,
  //   },
  //   visibility: 10000,
  //   wind: {
  //     speed: 0.62,
  //     deg: 349,
  //     gust: 1.18,
  //   },
  //   rain: {
  //     "1h": 3.16,
  //     "3h": 3.16,
  //   },
  //   clouds: {
  //     all: 100,
  //   },
  //   dt: 1661870592,
  //   sys: {
  //     type: 2,
  //     id: 2075663,
  //     country: "IT",
  //     sunrise: 1661834187,
  //     sunset: 1661882248,
  //   },
  //   timezone: 7200,
  //   id: 3163858,
  //   name: "Zocca",
  //   cod: 200,
  // };

  const convertToCelsius = (temp: number): number => {
    return Math.round(temp - 273.15);
  };

  const convertUtcTimestampToTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const convertUtcTimestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  console.log(weatherData);

  console.log(error);

  return (
    <div className="container mx-auto py-4 max-sm:p-4">
      <form onSubmit={fetchWeatherData} className="flex gap-4 my-8">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="grow border px-4 rounded-md bg-white focus-visible:outline-0 max-sm:text-sm"
        />
        <button
          type="submit"
          className="border-gradient-to-r from-sky-500 to-indigo-500 w-40 max-sm:w-fit py-4 max-sm:p-4 max-sm:text-sm rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:bg-white hover:text-gradient-to-r from-sky-500 to-indigo-500"
        >
          Get Weather
        </button>
      </form>
      {error.length === 0 ? (
        weatherData ? (
          <div className="flex max-sm:flex-col max-w-screen-md mx-auto gap-4">
            <div className="w-2/5 max-sm:w-full flex flex-col items-center justify-center gap-3 border rounded-md bg-white py-4">
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
                <span className="text-xl">{`${weatherData.name}, ${weatherData.sys.country}`}</span>
                <p className="text-slate-400">
                  {convertUtcTimestampToDate(weatherData.dt)}
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
                    <span className="text-2xl">
                      {weatherData.wind.speed} m/s
                    </span>
                  </div>
                  <Wind size={32} color="#6287f9" weight="duotone" />
                </div>
                <div className="flex justify-between items-center border rounded-md bg-white p-8 max-sm:p-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-400">Humidity</label>
                    <span className="text-2xl">
                      {weatherData.main.humidity} %
                    </span>
                  </div>
                  <Wind size={32} color="#6287f9" weight="duotone" />
                </div>
                {weatherData?.rain && (
                  <div className="flex justify-between items-center border rounded-md bg-white p-8 max-sm:p-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400">Rain</label>
                      <span className="text-2xl">
                        {weatherData?.rain?.["1h"] || weatherData?.rain?.["3h"]}{" "}
                        mm
                      </span>
                    </div>
                    <CloudRain size={32} color="#6287f9" weight="duotone" />
                  </div>
                )}

                <div className="flex justify-between items-center border rounded-md bg-white p-8 max-sm:p-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-400">Sunrise</label>
                    <span className="text-2xl">
                      {convertUtcTimestampToTime(weatherData.sys.sunrise)}
                    </span>
                  </div>
                  <SunHorizon size={32} color="#6287f9" weight="duotone" />
                </div>
                <div className="flex justify-between items-center border rounded-md bg-white p-8 max-sm:p-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-400">Sunset</label>
                    <span className="text-2xl">
                      {convertUtcTimestampToTime(weatherData.sys.sunset)}
                    </span>
                  </div>
                  <RainbowCloud size={32} color="#6287f9" weight="duotone" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <img
              src={landing}
              alt="Weather Landing"
              className="w-1/2 mx-auto"
            />
          </div>
        )
      ) : (
        <h3 className="text-center text-2xl">{error}</h3>
      )}
    </div>
  );
}

export default App;
