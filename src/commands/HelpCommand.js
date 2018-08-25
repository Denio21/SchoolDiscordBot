
const Command = require("./Command");
const Discord = require('discord.js');

class VoteStartCommand extends Command {

    getName() {
        return "help";
    }
    getUsage(){
        return "help";
    }
    getHelp(){
        return "Zobrazí tuto nápovědu.";
    }
    getGroup(){
        return "main";
    }
    getRoles(){
        return ["member"];
    }

    init(client, settings, commands) {
        this.settings = settings;
        this.commands = commands;
    }

    call(args, channel){
        let embed = new Discord.RichEmbed()
            .setTitle("💼 | Nápověda k používání bota")
            .setColor(0x9b59b6);
        
        let groups = {};
        Object.keys(this.settings["commands-groups"]).forEach(group => {
            groups[group] = [];
        });

        Object.values(this.commands).forEach(command => {
            groups[command.getGroup()].push(command);
        });

        let help = "";
        help += "Příkazy, které může používat člen jsou označeny **__takto__**.\n\n";

        Object.keys(groups).forEach(groupName => {
            let commands = groups[groupName];

            help += this.settings["commands-groups"][groupName] + "\n";
            commands.forEach(command => {
                let name;
                if(command.getRoles().includes("member"))
                    name = "**__" + this.settings.prefix + command.getUsage() + "__**";
                else
                    name = "**" + this.settings.prefix + command.getUsage() + "**";

                help += name + " - " + command.getHelp() + "\n";
            });

            help += "\n"
        });

        
        embed.setDescription(help);
    
        channel.send(embed).catch(console.error);
        return false;
    }

}

module.exports = VoteStartCommand;