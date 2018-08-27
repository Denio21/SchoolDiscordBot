const Command = require("./Command");
const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');

class RefreshSupplementationCommand extends Command {

    getName() {
        return "refreshsupplementation";
    }
    getUsage() {
        return "refreshsupplementation"
    }
    getGroup(){
        return "school";
    }
    getHelp() {
        return "Okamžitě zkontroluje a upraví suplování."
    }

    init(bot) {
        this.supplementationModule = bot.modules["supplementationmodule"];
    }

    call(args, channel){
        this.supplementationModule.tick();

        const embed = new Discord.RichEmbed()
            .setTitle("👓 | Suplování bylo aktualizováno.")
            .setDescription("Suplování bylo aktualizováno dle webových stránek školy.")
            .setColor(0xe67e22);

        channel.send(embed);

        return false;
    }

}

module.exports = RefreshSupplementationCommand;