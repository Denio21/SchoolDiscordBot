const Module = require("./Module");
const https = require('https');
const fs = require('fs');
const jsdom = require("jsdom");
const Discord = require('discord.js');
const { JSDOM } = jsdom;

class BakalariModule extends Module {

    getName() {
        return "bakalarimodule";
    }

    init(bot) {
        this.settings = bot.settings.modules.bakalari;
        this.webOptions = {
            host: this.settings.rss.domain,
            path: this.settings.rss.url
        }

        this.tempFile = "./temp/bakalari.json";
        this.channel = bot.client.channels.find(ch => ch.id == bot.settings.channels.bakalari);

        this.tick();
        setInterval(() => this.tick(), 30000);
    }

    tick() {
        let request = https.request(this.webOptions, (res) => {
            let data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', () => {
                const dom = new JSDOM(data, {
                    url: this.settings.fullUrl,
                    referrer: this.settings.fullUrl,
                    contentType: "text/html",
                    includeNodeLocations: true,
                    storageQuota: 10000000
                });

                let file = this.readFile(); 

                dom.window.document.querySelectorAll("item").forEach(children => {
                    let title = children.querySelectorAll("title")[0].textContent.trim();
                    let description = children.querySelectorAll("description")[0].textContent.trim();
                    let guid = children.querySelectorAll("guid")[0].textContent.trim();
                    let isTask = title.includes("ÚKOL");

                    if(file[guid] != undefined)
                        return;

                    description = description.replace(/<br \/>/g, "\n");

                    if(!isTask) {
                        if(title.includes("zapsána známka:") || description.includes("zapsána známka:")){
                            let subject = title.split(":")[0];

                            if(["VOP", "ANG", "PCV", "GRS", "PVA", "VYT"].includes(subject)){
                                return;
                            }

                            title = title.split(":")[0] + title.split(":")[1];
                            description = description.split(":")[0] + description.split(":")[1];
                        }
                    }

                    file[guid] = { title: title, description: description, isTask: isTask };


                    this.channel.send(this.generateEmbed(isTask, title, description));
                });

                this.saveFile(file);
            });
        });
        request.on('error', function (e) {
            console.log(e.message);
        });
        request.end();
    }

    generateEmbed(isTask, title, description){
        if(isTask){
            const embed = new Discord.RichEmbed()
                .setTitle("📚 | Nový úkol ze systému Bakalářů")
                .setDescription("Předmět a konec: **" + title.replace(/ÚKOL -/g, "") + "**\n\n" + description)
                .setColor(0xbadc58);

            return embed;
        } else {
            const embed = new Discord.RichEmbed()
                .setTitle("📚 | Nová informace ze systému Bakalářů")
                .setDescription("Titulek: **" + title + "**\n\n" + description)
                .setColor(0xbadc58);

            return embed;
        }
    }

    readFile() {
        let file = fs.readFileSync(this.tempFile, "utf8");
        let fileContents = JSON.parse(file);

        return fileContents;
    }

    saveFile(fileContents) {
        fs.writeFileSync(this.tempFile, JSON.stringify(fileContents));
    }

    event(name, args) {
    }

}

module.exports = BakalariModule;