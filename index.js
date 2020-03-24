var TelegramBot = require('node-telegram-bot-api');
var express = require('express');
var app = express();
var token = process.env.TG_KEY;
var apikey = process.env.APIKEY;
var accuweather = process.env.ACCU;
var bot = new TelegramBot(token, {polling:true});
var request = require('request');
var axios = require('axios');
bot.onText(/\movie (.+)/, function(msg, match) {
    console.log(msg);
    var movie = match[1];
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, '_Looking for _' + movie + '...', {parse_mode:'Markdown'});
    axios.get('http://omdbapi.com/', {
        params: {
            apikey,
            t: movie
        }   
    }).then(ax => {
        console.log(ax);
        bot.sendMessage(chatId, 'Result:\n '+ JSON.stringify(ax.data));        
    })
});
bot.onText(/\weather (.+)/, function(msg, match) {
    console.log(msg);
    var city = match[1];
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, '_Looking for _' + city + '...', {parse_mode:'Markdown'});
    axios.get('http://api.openweathermap.org/data/2.5/weather', {
        params: {
            appid: accuweather,
            units: 'metric',
            lang: 'ru',
            q: city
        }   
    }).then(ax => {
        console.log(ax);
        var clothes = 'Можно и не одеваться особо';
        if (ax.data.main.feels_like < 0)
        {
            clothes = 'Приоденьтесь потеплее';
        }
        var pressure = ax.data.main.pressure/1.333;
        pressure = pressure.toFixed(2);
        bot.sendMessage(chatId,'Нынче на улице ' + ax.data.weather[0].description + '\n' + 'Температура воздуха ' + ax.data.main.temp +'\n' + 'Если вдруг интересно, то давление '+ pressure + ' мм' +'\n' + 'По ощущениям как ' + ax.data.main.feels_like +'\n' + 'Ветерок ' + ax.data.wind.speed + ' м/с' + '\n' + clothes);        
    })
});
app.get('/', function (req, res) {
    res.send('Hello World!');
  });
  
  app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
  });