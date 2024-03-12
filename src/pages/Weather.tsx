import {
  ArrowLeft,
  DropHalf,
  MapPin,
  Thermometer,
} from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";

const Weather = () => {
  const location = useLocation();

  const weatherData = location.state;

  const convertToCelsius = (temp: number): number => {
    return Math.round(temp - 273.15);
  };

  return (
    <div className="m-auto bg-white max-w-lg w-full rounded-md shadow-md">
      <Link
        className="block p-4 text-sky-500 border-b-2 text-lg font-medium w-full flex items-center gap-2"
        to="/"
      >
        <ArrowLeft size={24} />
        Weather App
      </Link>
      {weatherData !== "error" ? (
        <>
          <div className="flex flex-col items-center justify-center gap-3 rounded-md py-4">
            <img
              alt={weatherData.weather[0].description}
              src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
              className="w-1/2"
            />
            <span className="text-sm font-medium">
              <b className="text-8xl font-semibold">
                {convertToCelsius(weatherData.main.temp)}
              </b>{" "}
              °C
            </span>
            <p className="capitalize text-lg">{`${weatherData.weather[0].main}, ${weatherData.weather[0].description}`}</p>
            <p className="capitalize text-xl flex items-center gap-1">
              <MapPin size={20} />
              {weatherData.name}
            </p>
          </div>
          <div>
            <div className="flex">
              <div className="flex justify-center items-center gap-2 border bg-white p-8 max-sm:p-4 w-full">
                <Thermometer size={32} color="#0ea5e9" weight="duotone" />
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400">Feels Like</label>
                  <span className="text-2xl">
                    {convertToCelsius(weatherData.main.feels_like)} °C
                  </span>
                </div>
              </div>
              <div className="flex justify-center items-center gap-2 border bg-white p-8 max-sm:p-4 w-full">
                <DropHalf size={32} color="#0ea5e9" weight="duotone" />
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400">Humidity</label>
                  <span className="text-2xl">
                    {weatherData.main.humidity} %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="mx-auto mt-8 pb-8 text-center">Please try again!</p>
      )}
    </div>
  );
};

export default Weather;
