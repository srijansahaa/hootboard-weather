import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import landing from "./assets/landing.png";
import loader from "./assets/loading.gif";
import { LocationItem, PlaceItem, WeatherItem } from "./interfaces";
import Weather from "./components/weather";

function App() {
  const [weatherData, setWeatherData] = useState<WeatherItem[] | null>(null);
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
      console.log(response.data);
      setWeatherData(response.data.list);
      setPlaceData(response.data.city);
      setLoading(false);
    } catch (error) {
      setError("Enter a valid search");
      setLoading(false);
    }
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
          <div className="flex flex-col items-center gap-8">
            {weatherData.map((weather, index) => (
              <Weather
                key={index.toString()}
                weatherData={weather}
                placeData={placeData}
              />
            ))}
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
