getWeather("Bhandara");
// Function to fetch data when user enters city or region name
function getWeather(ele) {
	let city;
	if (ele == undefined) city = document.getElementById("query").value;
	else city = ele;

	console.log({ city, ele });

	let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7ba2b1de0ab33d7af34525a99b67d3e5`;

	fetch(url)
		.then(function (res) {
			return res.json();
		})
		.then(function (res) {
			showWheather(res);
		})
		.catch(function (err) {
			console.log(err);
		});
}

//Function to display weather to user
function showWheather(data) {
	let map = `https://maps.google.com/maps?q=${data.name}&t=&z=19&ie=UTF8&iwloc=&output=embed`;

	let div = document.querySelector("#container");
	div.innerHTML = null;

	let city = document.createElement("h1");
	city.innerText = data.name;
	let tempdiv = document.createElement("div");
	let temp = document.createElement("h2");
	temp.innerText = (data.main.temp - 275).toFixed(0);

	let cel = document.createElement("p");
	cel.innerText = "°c";
	tempdiv.append(temp, cel);

	let MinMax = document.createElement("div");
	MinMax.classList.add("minMaxTemp");
	let tempMin = document.createElement("h4");
	tempMin.innerText = (data.main.temp_min - 273).toFixed(0) + "°c";

	let tempMax = document.createElement("h4");
	tempMax.innerText = (data.main.temp_max - 268).toFixed(0) + "°c";
	MinMax.append(tempMin, tempMax);

	let humidity = document.createElement("h3");
	humidity.innerText = "Humidity : " + data.main.humidity;

	let weat = document.createElement("h5");
	weat.innerText = ` Weather : ${data.weather[0].main} ${data.weather[0].description}`;

	let whole = document.createElement("div");
	whole.classList.add("sunriseSection");
	let rise = document.createElement("div");
	let rise_img = document.createElement("img");
	rise_img.src = "./images/sunrise.png";
	let sunrise = document.createElement("h3");
	let sunRisePLaceholder = document.createElement("span");
	sunRisePLaceholder.classList.add("sunPlaceholder");
	sunRisePLaceholder.innerText = "Sunrise";

	let t = data.sys.sunrise;
	let result = new Date(t * 1000).toISOString().slice(11, 19);
	result = convertTimetoIST(result);
	sunrise.innerText = result;
	rise.append(rise_img, sunrise, sunRisePLaceholder);

	let set = document.createElement("div");
	let set_img = document.createElement("img");
	set_img.src = "./images/sunset.png";
	let sunset = document.createElement("h3");
	let sunSetPlaceholder = document.createElement("span");
	sunSetPlaceholder.innerText = "Sunset";
	sunSetPlaceholder.classList.add("sunPlaceholder");
	t = data.sys.sunset;
	result = new Date(t * 1000).toISOString().slice(11, 19);
	result = convertTimetoIST(result);
	sunset.innerText = result;
	set.append(set_img, sunset, sunSetPlaceholder);

	whole.append(rise, set);

	div.append(city, tempdiv, MinMax, whole, humidity, weat);

	let iframe = document.getElementById("gmap_canvas");
	iframe.src = map;

	sevenDaysForcast(data);
}

//Function to display 7 days weather forecast
function sevenDaysForcast(data) {
	let seven = document.querySelector("#seven");
	seven.innerHTML = null;
	let week = getSevenDays();
	let days = {
		0: "Sun",
		1: "Mon",
		2: "Tue",
		3: "Wed",
		4: "Thurs",
		5: "Fri",
		6: "Sat",
	};
	week.forEach(function (elem) {
		let div = document.createElement("div");

		let day = document.createElement("h3");
		day.innerText = days[elem];

		let random = Math.floor(Math.random() * 5) + 1;
		let max = document.createElement("h4");
		let max_temp = (data.main.temp_max - 268 - random).toFixed(0);
		max.innerText = max_temp + "°";
		random = Math.floor(Math.random() * 4) + 1;
		let min = document.createElement("p");
		min.innerText = (data.main.temp_min - 272 - random).toFixed(0) + "°";

		let img = document.createElement("img");

		if (max_temp >= 30) img.src = "images/sunny.png";
		else if (max_temp >= 25 && max_temp < 30) img.src = "images/cloudy.png";
		else if (max_temp >= 20 && max_temp < 25) img.src = "images/rainy.png";
		else img.src = "images/snow.png";
		div.append(day, img, max, min);

		seven.append(div);
	});
}

//Function to get upcoming 7 days weekday
function getSevenDays() {
	let days = [];
	var date = new Date();
	for (let i = 1; i <= 7; i++) {
		let day = date.getDay() + i;
		days.push(day % 7);
	}
	return days;
}

//Function to convert time in seconds format to HH:MM:SS AM / PM
function convertTimetoIST(time) {
	time = time.split(":").map(Number);
	let [hh, mm, ss] = time;
	mm += 30;
	hh += 5;
	if (mm > 60) {
		mm -= 60;
		++hh;
	}
	let timeStamp = "AM";
	if (hh >= 12) {
		timeStamp = "PM";
	}
	if (hh > 12) {
		hh -= 12;
	}

	return `${hh}:${mm} ${timeStamp}`;
}

// On-Load function
window.addEventListener("load", function () {
	getLocation();
});

if (window.innerWidth > 600) {
	document.getElementById("gmap_canvas").width = "571";
}

document.getElementById("search").addEventListener("click", function () {
	const queryValue = document.getElementById("query").value;
	getWeather(queryValue);
});

//function to get users location
function getLocation() {
	navigator.geolocation.getCurrentPosition(success);

	function success(pos) {
		const crd = pos.coords;
		WeatherLocation(crd.latitude, crd.longitude);
	}
}

//function to fetch data form API
function WeatherLocation(lat, lon) {
	let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=7ba2b1de0ab33d7af34525a99b67d3e5`;

	fetch(url)
		.then(function (res) {
			return res.json();
		})
		.then(function (res) {
			showWheather(res);
		});
}
