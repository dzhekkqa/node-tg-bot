var TelegramBot = require('node-telegram-bot-api');
var express = require('express');
var app = express();
var token = process.env.TG_KEY;
var apikey = process.env.APIKEY;
var accuweather = process.env.ACCU;
var bot = new TelegramBot(token, {polling:true});
var request = require('request');
var axios = require('axios');
bot.onText(/\помощь/, function(msg, match) {
    console.log(msg);
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Добро пожаловать в погодного бота!' + '\n' + 'Чтобы узнать погоду на сегодня, введите /погода и название города' + '\n' + 'Чтобы узнать что надеть сегодня, введите /совет и название города' + '\n' + 'Чтобы узнать прогноз на 5 дней, введите /прогноз5 и название города');        
    });
//bot.sendMessage(chatId, 'Добро пожаловать в погодного бота!' + '\n' + 'Чтобы узнать погоду, введите погода и название города' + '\n' + 'Чтобы узнать что надеть, введите совет и название города');
bot.onText(/\погода (.+)/, function(msg, match) {
    console.log(msg);
    var city = match[1];
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Ищу этот ваш ' + city + '...', {parse_mode:'Markdown'});
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
bot.onText(/\прогноз5 (.+)/, function(msg, match) {
    console.log(msg);
    var city = match[1];
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Ищу этот ваш ' + city + '...', {parse_mode:'Markdown'});
    axios.get('http://api.openweathermap.org/data/2.5/forecast', {
        params: {
            appid: accuweather,
            units: 'metric',
            lang: 'ru',
            q: city
        }   
    }).then(ax => {
        console.log(ax);
        var message = '';
        var size = ax.data.list.length;
        var index = [];
        for (var i = 0; i < size-1; i++)
        {
            var day = ax.data.list[i].dt_txt;
            var day1 = ax.data.list[i+1].dt_txt;
            day = day.substring(0,10);
            day1 = day1.substring(0,10);
            if(day != day1)
            {
                var daya = ax.data.list[i+1].dt_txt;
                daya = daya.substring(0,10);
                var temp = ax.data.list[i+1].main.temp;
                var wind = ax.data.list[i+1].wind.speed;
                message = message + 'День : ' + daya + ' температура: ' + temp + ' градусов' +' ветер: ' + wind + ' м/c' +'\n' +'\n';
            }
        }
        bot.sendMessage(chatId, message);
    })
});
bot.onText(/\погодазавтра (.+)/, function(msg, match) {
    console.log(msg);
    var city = match[1];
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Ищу этот ваш ' + city + '...', {parse_mode:'Markdown'});
    axios.get('http://api.openweathermap.org/data/2.5/forecast', {
        params: {
            appid: accuweather,
            units: 'metric',
            lang: 'ru',
            q: city
        }   
    }).then(ax => {
        console.log(ax);
        var message = '';
        var size = ax.data.list.length;
        var index = [];
        for (var i = 0; i < size-1; i++)
        {
            var day = ax.data.list[i].dt_txt;
            var day1 = ax.data.list[i+1].dt_txt;
            day = day.substring(0,10);
            day1 = day1.substring(0,10);
            if(day != day1)
            {
                var daya = ax.data.list[i+1].dt_txt;
                daya = daya.substring(0,10);
                var temp = ax.data.list[i+1].main.temp;
                var wind = ax.data.list[i+1].wind.speed;
                message = message + 'День : ' + daya + ' температура: ' + temp + ' градусов' + ' ветер: ' + wind + ' м/c' + '\n' +'\n';
            }
            break;
        }
        bot.sendMessage(chatId, message);
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