
import React, { useState } from "react";
import axios from "axios";
import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Replace this with your actual OpenWeather API key
  const API_KEY = "b7ad1c309ebfe9de5d65263f206f2c6d";

  const searchWeather = async (event) => {
    event.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: city.trim(),
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      setWeather(response.data);
    } catch (err) {
      setWeather(null);

      if (err.response?.status === 401) {
        setError(
          "Invalid API key. Check your OpenWeather API key and activation status."
        );
      } else if (err.response?.status === 404) {
        setError("City not found. Please enter a valid city name.");
      } else if (!err.response) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Unable to fetch weather. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-card">
        <p className="weather-label">LIVE WEATHER</p>

        <h1>Weather Report</h1>

        <p className="weather-subtitle">
          Discover the weather anywhere in the world.
        </p>

        <form className="weather-search" onSubmit={searchWeather}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(event) => setCity(event.target.value)}
            aria-label="City name"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="weather-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        {weather && (
          <div className="weather-result">
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>

            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />

            <h3 className="weather-temperature">
              {Math.round(weather.main.temp)}°C
            </h3>

            <p className="weather-description">
              {weather.weather[0].description}
            </p>

            <div className="weather-details">
              <div className="weather-detail">
                <span>💧</span>
                <p>Humidity</p>
                <strong>{weather.main.humidity}%</strong>
              </div>

              <div className="weather-detail">
                <span>💨</span>
                <p>Wind Speed</p>
                <strong>{weather.wind.speed} m/s</strong>
              </div>

              <div className="weather-detail">
                <span>🌡️</span>
                <p>Feels Like</p>
                <strong>
                  {Math.round(weather.main.feels_like)}°C
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;

