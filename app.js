const zip = document.querySelector(".zip");
const searchIcon = document.querySelector(".search-icon");
const temp = document.querySelector(".temp");
const weatherImg = document.querySelector(".weather-img");
const weatherInfo = document.querySelector(".weather-info");
const description = document.querySelector(".description");

searchIcon.addEventListener("click", () => {
  const zipCode = zip.value;
  if (zipCode.length > 0) {
    getCoordinates(zipCode)
      .then((coordinates) => {
        getWeather(coordinates.longitude, coordinates.latitude);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  } else {
    alert("Please provide a zip code.");
  }
});

async function getWeather(longitude, latitude) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&temperature_unit=fahrenheit&current_weather=true`
  );
  const jsonData = await response.json();
  console.log(jsonData);
  var wc = jsonData.current_weather.weathercode;
  if (wc == 0) {
    weatherImg.src = "/imgs/sunny.png";
    description.innerHTML = `Sunny`;
  } else if (wc == 1 || wc == 2 || wc == 3) {
    weatherImg.src = "/imgs/cloudy.png";
    description.innerHTML = `Cloudy`;
  } else if ((wc > 50) & (wc < 60)) {
    weatherImg.src = "/imgs/light-rain.png";
    description.innerHTML = `Light Rain`;
  } else if ((wc > 60) & (wc < 68) || wc == 80 || wc == 81 || wc == 82) {
    weatherImg.src = "/imgs/heavy-rain.png";
    description.innerHTML = `Heavy Rain`;
  } else if (wc > 94) {
    weatherImg.src = "/imgs/thunder.png";
    description.innerHTML = `Thunder & Lightning`;
  } else {
    weatherImg.src = "/imgs/sunny.png";
    description.innerHTML = `Sunny`;
  }

  temp.innerHTML = parseInt(jsonData.current_weather.temperature) + "°F";
  weatherInfo.style.display = "flex";
}

async function getCoordinates(zipCode) {
  const nominatimApiUrl = `https://nominatim.openstreetmap.org/search?q=${zipCode}&format=json`;

  try {
    const response = await fetch(nominatimApiUrl);
    const data = await response.json();

    if (data.length > 0) {
      const location = data[0];
      const latitude = parseFloat(location.lat);
      const longitude = parseFloat(location.lon);
      return { latitude, longitude };
    } else {
      throw new Error("Unable to geocode the provided zip code.");
    }
  } catch (error) {
    console.error(error);
  }
}
