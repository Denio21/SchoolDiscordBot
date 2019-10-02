const DirectCommand = require("./DirectCommand");
const Discord = require("discord.js");
const Config = require("../Config");

class BakalariCommand extends DirectCommand {

    getName() {
        return "bakalari";
    }

    getGroup() {
        return "main";
    }

    getRoles() {
        return ["member"];
    }
    
    getDependencies() {
        return ["directbakalarimodule"];
    }

    init(bot) {
        this.client = bot.client;
        this.directBakalariModule = bot.modules["directbakalarimodule"];
    }

    async call(args, message) {
        const channel = message.channel;

        if(args.length == 0) {
            this.sendHelp(channel);
            return;
        }

        const rssToken = args[0];

        await this.directBakalariModule.addRssTokenForUser(message.author.id, rssToken);

        const embed = new Discord.RichEmbed()
            .setTitle("📣 | RSS token změněn.")
            .setDescription("RSS token byl změněn. Během pár minut dostanete upozornění o známkách. Pokuď se tak nestane do hodiny a bot je online, nejspíše jste zadali špatný token - proto jej zadejte znovu a správně (vše za ?bk=).")
            .setColor(Config.getColor("SUCCESS"));

        channel.send(embed);
    }

}

module.exports = BakalariCommand;