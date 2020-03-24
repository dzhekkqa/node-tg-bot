var TelegramBot = require('node-telegram-bot-api');
var express = require('express');
var app = express();
var token = process.env.TG_KEY;
var apikey = process.env.APIKEY;
var bot = new TelegramBot(token, {polling:true});
var request = require('request');
bot.onText(/\movie (.+)/, function(msg,match){
    console.log(msg);
    var movie = match[1];
    var chatId = msg.chat.id;
    request(`http://omdbapi.com/?apikey=${apikey}&t=${movie}`, function(error,response,body){
        if (!error && response.statusCode == 200){
            bot.sendMessage(chatId, '_Looking for _' + movie + '...', {parse_mode:'Markdown'});
            bot.sendMessage(chatId, 'Result:\n '+ body)
        } else {
            console.error(error);
        }
    });
});
app.get('/', function (req, res) {
    res.send('Hello World!');
  });
  
  app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
  });