import React, { useEffect, useState } from "react";
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
import loader from "./assets/loading.gif";
import { LocationItem, PlaceItem, WeatherItem } from "./interfaces";

function App() {
  const [weatherData, setWeatherData] = useState<WeatherItem | null>(null);
  const [error, setError] = useState<string>("");
  const [city, setCity] = useState("");
  const [placeData, setPlaceData] = useState<PlaceItem | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<LocationItem[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://test.api.amadeus.com/v1/security/oauth2/token",
          new URLSearchParams({
            grant_type: "client_credentials",
            client_id: "2S3eA1mWmdxbqHsHL5A9vz6OMxDr3vZU",
            client_secret: "qD2RaG7ExrZjwvcZ",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };
    fetchData();
  }, []);

  const fetchWeatherData = async (e: { preventDefault: () => void }) => {
    setLoading(true);
    e.preventDefault();
    setCitySuggestions([]);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=832757f844ba393972494e7ba530773f`
      );
      setError("");
      setWeatherData(response.data.list[0]);
      setPlaceData(response.data.city);
      setLoading(false);
    } catch (error) {
      setError("Enter a valid search");
      setLoading(false);
    }
  };

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

  const handleCitySearch = async (city: string) => {
    setCity(city);
    if (city.length > 2) {
      try {
        const response = await axios.get(
          `https://test.api.amadeus.com/v1/reference-data/locations/cities?keyword=${city}&max=5`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data.data) {
          setCitySuggestions(response.data.data);
        } else setCitySuggestions([]);
      } catch (error) {
        console.log(error);
        setCitySuggestions([]);
      }
    } else {
      setCitySuggestions([]);
    }
  };

  return (
    <div className="container mx-auto py-4 max-sm:p-4">
      <div className="relative my-8">
        <form onSubmit={fetchWeatherData} className="flex gap-4">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => handleCitySearch(e.target.value)}
            className="grow border px-4 rounded-md bg-white focus-visible:outline-0 max-sm:text-sm"
          />

          <button
            type="submit"
            className="border-gradient-to-r from-sky-500 to-indigo-500 w-40 max-sm:w-fit py-4 max-sm:p-4 max-sm:text-sm rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:bg-white hover:text-gradient-to-r from-sky-500 to-indigo-500"
          >
            Get Weather
          </button>
        </form>
        {citySuggestions.length > 0 && (
          <div className="flex flex-col absolute bg-white border rounded-md w-full">
            {citySuggestions.map((city, index) => (
              <span
                key={index.toString()}
                className="cursor-pointer hover:bg-slate-100 px-4 py-2"
                onClick={(e) => {
                  setCity(city.name);
                  fetchWeatherData(e);
                  setCitySuggestions([]);
                }}
              >
                {city.name}
              </span>
            ))}
          </div>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center">
          <img src={loader} alt="Loading..." className="w-32" />
        </div>
      ) : error.length === 0 ? (
        weatherData && placeData ? (
          <div className="flex max-sm:flex-col max-w-screen-md mx-auto gap-4">
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
                <span className="text-xl">{`${placeData.name}, ${placeData.country}`}</span>
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
