// const geocode = require('./utils/geocode')
// const forecast = require('./utils/forecast')

// const address = process.argv[2]

// if (!address) {
//     console.log('Please provide an address')
// } else {
//     geocode(address, (error, { latitude, longitude, location }) => {
//         if (error) {
//             return console.log(error)
//         }

//         forecast(latitude, longitude, (error, forecastData) => {
//             if (error) {
//                 return console.log(error)
//             }

//             console.log(location)
//             console.log(forecastData)
//         })
//     })
// }

const request = require('request')

const url = `http://api.weatherstack.com/current?access_key=2e5a9fddd881d477c9588cd1c1e9fa73&query=37.8267,-122.4233&units=f`

request({ url: url, json: true }, (error, response) => {
    console.log(response.body.current.weather_descriptions[0] + ' It is currenctly ' + response.body.current.temperature + ' degress out. There is a ' + response.body.current.pressure);
    
    
})

const geocode = `https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1Ijoic2VyY2hubSIsImEiOiJja2JnczJwOW0xOGY1MnltdTdsNXN5Znk4In0.3WG1eaTkdTbEzXzOWSUxeg&limit=1`

request({ url: geocode, json: true }, (error, response) => {
    const latitude = response.body.features[0].center[1];
    const longitude = response.body.features[0].center[0]
    console.log(latitude, longitude); 
    
})