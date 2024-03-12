import { useEffect, useState } from "react";
import axios from "axios";
import { LocationItem } from "../interfaces";
import { useNavigate } from "react-router-dom";
import loader from "../assets/loading.gif";

function GetWeather() {
  const [city, setCity] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<LocationItem[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

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
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=832757f844ba393972494e7ba530773f`
      );
      console.log(response);
      setLoading(false);
      navigate("/weather", { state: response.data });
    } catch (error) {
      console.log(error);
      setLoading(false);
      navigate("/weather", { state: "error" });
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

  const handleDeviceLocation = async () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      try {
        const position: GeolocationPosition = await new Promise(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=832757f844ba393972494e7ba530773f`
          );
          setLoading(false);
          navigate("/weather", { state: response.data });
        } catch (error) {
          console.log(error);
          setLoading(false);
          navigate("/weather", { state: "error" });
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        navigate("/weather", { state: "error" });
      }
    }
  };

  return (
    <>
      {loading && (
        <div className="absolute flex justify-center items-center w-full h-screen bg-black/30 z-10">
          <img src={loader} alt="Loading..." className="w-32" />
        </div>
      )}
      <div className="m-auto flex flex-col bg-white max-w-lg w-full rounded-md shadow-md">
        <h1 className="p-4 text-sky-500 border-b-2 text-lg font-semibold mb-4">
          Weather App
        </h1>
        <div className="p-4">
          <form onSubmit={fetchWeatherData}>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => handleCitySearch(e.target.value)}
                className="w-full border px-4 rounded-md bg-white focus-visible:outline-0 max-sm:text-sm h-12 text-center"
                tabIndex={1}
              />
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
          </form>
          <span className="flex items-center text-center gap-2 my-4 text-slate-500 before:block before:w-full before:h-px before:bg-slate-200 after:w-full after:h-px after:bg-slate-200">
            or
          </span>
          <button
            className="bg-sky-500 h-12 w-full rounded-md text-white font-semibold max-sm:text-sm"
            onClick={handleDeviceLocation}
            tabIndex={2}
          >
            Get Device Location
          </button>
        </div>
      </div>
    </>
  );
}

export default GetWeather;
