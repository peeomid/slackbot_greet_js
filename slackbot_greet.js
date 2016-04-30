var Botkit = require('botkit');
var winston = require('winston');
var config = require('./config');

var controller = Botkit.slackbot({
	json_file_store: './db_slackbutton_bot/',
	logger: new winston.Logger({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: './bot.log' })
    ]
  })
});
var log = controller.logger;
var bot = controller.spawn({
  token: config.team_token
})

var slack_helper = {
	getDirectMessageChannel: function(bot, user, cb) {
		bot.api.im.open({'user': user}, cb);
	},
	sendMessage: function(bot, channel, message) {
		var msg = {};
		msg.text = message;
		msg.channel = channel;

		bot.say(msg);
	}
}

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.on('presence_change', function(bot, message){	
	controller.logger.info(message);
	user = message.user

	slack_helper.getDirectMessageChannel(bot, user, function(err, res){
		if (!err) {			
			console.log(res)
			channel = res.channel['id']			
			message = 'hi there <@' + user + '>';
			slack_helper.sendMessage(bot, channel, message);
			
		}		
	})

});