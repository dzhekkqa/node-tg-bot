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
bot.onText(/\start/, function(msg, match) {
    console.log(msg);
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Добро пожаловать в погодного бота!' + '\n' + 'Чтобы узнать погоду, введите погода и название города' + '\n' + 'Чтобы узнать что надеть, введите совет и название города');        
    });
//bot.sendMessage(chatId, 'Добро пожаловать в погодного бота!' + '\n' + 'Чтобы узнать погоду, введите погода и название города' + '\n' + 'Чтобы узнать что надеть, введите совет и название города');
bot.onText(/\погода (.+)/, function(msg, match) {
    console.log(msg);
    var city = match[1];
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, '_Ищу этот ваш _' + city + '...', {parse_mode:'Markdown'});
    axios.get('http://api.openweathermap.org/data/2.5/weather', {
        params: {
            appid: accuweather,
            units: 'metric',
            lang: 'ru',
            q: city
        }   
    }).then(ax => {
        console.log(ax);
        var pressure = ax.data.main.pressure/1.333;
        pressure = pressure.toFixed(2);
        bot.sendMessage(chatId,'Нынче на улице ' + ax.data.weather[0].description + '\n' + 'Температура воздуха ' + ax.data.main.temp + ' градусов' +'\n' + 'Если вдруг интересно, то давление '+ pressure + ' мм' +'\n' + 'По ощущениям как ' + ax.data.main.feels_like + ' градусов' + '\n' + 'Ветерок ' + ax.data.wind.speed + ' м/сек');        
    })
});
bot.onText(/\погода1 (.+)/, function(msg, match) {
    console.log(msg);
    var city = match[1];
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, '_Ищу этот ваш _' + city + '...', {parse_mode:'Markdown'});
    axios.get('http://api.openweathermap.org/data/2.5/forecast', {
        params: {
            appid: accuweather,
            units: 'metric',
            lang: 'ru',
            q: city
        }   
    }).then(ax => {
        console.log(ax);
        var day = ax.data.list[1].dt_txt;
        var pressure = ax.data.list[1].main.pressure/1.333;
        pressure = pressure.toFixed(2);
        day = day.substring(0,10);
        bot.sendMessage(chatId, 'День: '+ day + '\n' + 'Нынче на улице ' + ax.data.list[1].weather[0].description + '\n' + 'Температура воздуха ' + ax.data.list[1].main.temp + ' градусов' + '\n' + 'Если вдруг интересно, то давление '+ pressure + ' мм' + '\n' + 'По ощущениям как '+ ax.data.list[1].main.feels_like + ' градусов' + '\n' + 'Ветерок ' + ax.data.list[1].wind.speed + ' м/сек');
    })
});
bot.onText(/\совет (.+)/, function(msg, match) {
    console.log(msg);
    var city = match[1];
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, '_Что бы надеть... _' + city + '...', {parse_mode:'Markdown'});
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
        if (ax.data.main.feels_like < 0 && ax.data.main.feels_like > -13)
        {
            clothes = 'Приоденьтесь потеплее';
        }
        if (ax.data.main.feels_like < -20)
        {
            clothes = 'Наденьте все тёплые вещи, которые найдете';
        }
        if (ax.data.wind.speed > 6 && ax.data.wind.speed < 15)
        {
            clothes = clothes + ', наденьте что-нибудь от ветра';
        }
        if (ax.data.weather[0].description == 'пасмурно' && ax.data.main.feels_like > 0)
        {
            clothes = clothes + ', рекомендую взять зонт';
        }
        if (ax.data.wind.speed > 15)
        {
            clothes = clothes + ', вас может сдуть, будьте осторожны'
        }
        var pressure = ax.data.main.pressure/1.333;
        pressure = pressure.toFixed(2);
        bot.sendMessage(chatId,'\n' + clothes);        
    })
});
app.get('/', function (req, res) {
    res.send('Hello World!');
  });
  
  app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
  });