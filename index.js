/*
    This script made by ISYTLO at 2026,Jun,29 
    Finished at 6:08AM
   This bot was primarily developed for the Discord server Twinkle, owned by Kii (k7lani).

    Its purpose is to provide an interactive color role system and additional server features to enhance the overall member experience.

    And I guess it will be open source







    { this is for me don't mind it
    git add .
    git commit -m " "
    git push
    }
    node index.js
*/


require("dotenv").config();

console.log("TOKEN RAW =", JSON.stringify(process.env.TOKEN));
console.log("TOKEN LENGTH:", process.env.TOKEN?.length);
console.log("TOKEN START:", process.env.TOKEN?.slice(0, 10));

const fs = require("fs");

const {
    Client,
    GatewayIntentBits,
    Events,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { channel } = require("diagnostics_channel");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const guild = client.guilds.cache.get("SERVER_ID");
const colorChannelId = "1520198376795410496"

let colors = {
    red: {
        name: "Red",
        label: "🌹 Red",
        color: "#FF0000",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Danger,
    },

    orange: {
        name: "Orange",
        label: "🍊 Orange",
        color: "#FF7F00",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Primary,
    },

    yellow: {
        name: "Yellow",
        label: "🌞 Yellow",
        color: "#FFD700",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Primary,
    },

    lime: {
        name: "Lime",
        label: "🍋 Lime",
        color: "#7FFF00",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Success,
    },

    green: {
        name: "Green",
        label: "🍃 Green",
        color: "#00C853",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Success,
    },

    cyan: {
        name: "Cyan",
        label: "💧 Cyan",
        color: "#00E5FF",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Primary,
    },

    blue: {
        name: "Blue",
        label: "🌊 Blue",
        color: "#2979FF",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Primary,
    },

    purple: {
        name: "Purple",
        label: "🔮 Purple",
        color: "#7B1FA2",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Secondary,
    },

    sky: {
        name: "Sky",
        label: "☁️ Sky",
        color: "#87CEEB",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Secondary,
    },

    mint: {
        name: "Mint",
        label: "🌿 Mint",
        color: "#98FF98",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Success,
    },

    lavender: {
        name: "Lavender",
        label: "💐 Lavender",
        color: "#C8A2C8",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Secondary,
    },

    peach: {
        name: "Peach",
        label: "🍑 Peach",
        color: "#FFDAB9",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Secondary,
    },

    sage: {
        name: "Sage",
        label: "🌱 Sage",
        color: "#9CAF88",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Success,
    },

    ocean: {
        name: "Ocean",
        label: "🌊 Ocean",
        color: "#4F83CC",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Primary,
    },

    slate: {
        name: "Slate",
        label: "🪨 Slate",
        color: "#708090",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Secondary,
    },

    rose: {
        name: "Rose",
        label: "🌺 Rose",
        color: "#F4C2C2",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Secondary,
    },

    ice: {
        name: "Ice",
        label: "❄️ Ice",
        color: "#E0FFFF",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Secondary,
    },

    sand: {
        name: "Sand",
        label: "🏖️ Sand",
        color: "#D2B48C",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Secondary,
    },

    fog: {
        name: "Fog",
        label: "🌫️ Fog",
        color: "#D3D3D3",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Secondary,
    },

    midnight: {
        name: "Midnight",
        label: "🌌 Midnight",
        color: "#2C3E50",
        reason: "Created by ISYTLO's bot for interface",
        style: ButtonStyle.Secondary,
    }
};

async function deleteColorRoles(guild) {
    const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

    for (const key in colors) {
        const saved = data[key];
        if (!saved) continue;

        const role = await guild.roles.fetch(saved.id).catch(() => null);
        if (!role) continue;

        if (!role.editable) {
            console.log(`Cannot delete: ${role.name}`);
            continue;
        }

        try {
            await role.delete("Deleting color role system");
            console.log(`Deleted: ${role.name}`);
        } catch (err) {
            console.log(`Failed: ${role.name} -> ${err.message}`);
        }
    }
}

async function setAllRolesToGrey(guild) {
    const roles = await guild.roles.fetch();

    const failed = [];

    for (const role of roles.values()) {
        if (!role) continue;
        if (role.id === guild.id) continue;

        try {
            await role.setColor("#808080");
        } catch (err) {
            failed.push(role.name);
            console.log(err.message);
        }
    }

    console.log("DONE");
    console.log("Failed roles:", failed);
}

async function recreateColors(guild, chan) {
    const data = {};

    for (const key in colors) {
        const color = colors[key];

        let role = guild.roles.cache.find(r => r.name === color.name);

        if (role) {
            try {
                await role.delete("Recreating color system");
            } catch (err) {
                console.log("Delete failed:", err.message);
            }
        }

        role = await guild.roles.create({
            name: color.name,
            color: color.color,
            reason: color.reason
        });

        console.log(`Recreated ${color.name}`);
        chan.send(`Recreated ${color.name}`);

        data[key] = {
            id: role.id
        };
    }

    fs.writeFileSync("data.json", JSON.stringify(data, null, 4));
}

async function syncColorRoles(guild) {
    const fs = require("fs");

    const text = fs.readFileSync("data.json", "utf8");
    const data = text.trim() ? JSON.parse(text) : {};

    for (const key in colors) {
        const color = colors[key];

        let role = guild.roles.cache.find(r => r.name === color.name);

        if (!role) {
            role = await guild.roles.create({
                name: color.name,
                color: color.color,
                reason: "Auto-sync color system"
            });

            console.log(`Recreated missing role: ${color.name}`);
        }

        if (!data[key] || data[key].id !== role.id) {
            data[key] = { id: role.id };
            console.log(`Synced JSON for ${color.name}`);
        }
    }

    fs.writeFileSync("data.json", JSON.stringify(data, null, 4));
    console.log("Color roles fully synced.");
}

client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.first();

    await saveColorData(guild)
});

async function getColorFromData(color) {
    const fs = require("fs");

    const text = fs.readFileSync("data.json", "utf8");
    const data = text.trim() ? JSON.parse(text) : {};

    return data[color];
}

async function saveColorData(colorName, id) {
    const data = JSON.parse(
        fs.readFileSync("data.json", "utf8")
    );

    data[colorName] = {
        id: id
    };

    fs.writeFileSync("data.json", JSON.stringify(data, null, 4));
}

async function addColor(message) {

    const rows = [];
    let row = new ActionRowBuilder();
    let count = 0;

    for (const key in colors) {

        const color = colors[key];

        row.addComponents(
            new ButtonBuilder()
                .setCustomId(key)
                .setLabel(color.label)
                .setStyle(color.style)
        );

        count++;

        if (count === 5) {
            rows.push(row);
            row = new ActionRowBuilder();
            count = 0;
        }
    }

    if (count > 0) rows.push(row);

    await message.channel.bulkDelete(100, true);

    await message.channel.send({
        content: "Choose your color:",
        components: rows
    });
}

async function sendColorMenu(channel) {
    const rows = [];
    let row = new ActionRowBuilder();
    let count = 0;

    for (const key in colors) {
        const color = colors[key];

        row.addComponents(
            new ButtonBuilder()
                .setCustomId(key)
                .setLabel(color.label)
                .setStyle(color.style)
        );

        count++;

        if (count === 5) {
            rows.push(row);
            row = new ActionRowBuilder();
            count = 0;
        }
    }

    if (count > 0) rows.push(row);

    return await channel.send({
        content: "Choose your color:",
        components: rows
    });
}

async function deleteAllBotMessages(channel) {
    let lastId;

    while (true) {
        const messages = await channel.messages.fetch({
            limit: 100,
            before: lastId
        });

        if (messages.size === 0) break;

        const botMessages = messages.filter(m => m.author.bot);

        if (botMessages.size > 0) {
            await channel.bulkDelete(botMessages, true).catch(() => {});
        }

        lastId = messages.last()?.id;
    }

    console.log("Deleted all bot messages in channel.");
}

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const guild = message.guild;
    const channel = await guild.channels.fetch(colorChannelId).catch(() => null);
 const args = message.content.trim();

    switch (args) {

        case "!colors":
            await addColor(message);
            break;

        case "ISYColors: deleteAll":
        case "ISYColors: DEA":
            await deleteColorRoles(message.guild);
            break;

        case "ISYColors: createColors":
        case "ISYColors: CC":
            await recreateColors(message.guild, message.channel);
            break;

        case "ISYColors: setRolesGray":
        case "ISYColors: SRG":
            await setAllRolesToGrey(message.guild);
            break;

        case "ISYColors: here":
            await addColor(message);
            break;
        case "!say":
            message.reply("alr")
            break;
        case "ISYColors: dletBotsMsgs":
        case "ISYColors: DBM":
            deleteAllBotMessages(message.channel)
        break;
    }
    
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    const color = colors[interaction.customId];
    if (!color) return;

    await interaction.deferUpdate();

    const disabledRows = interaction.message.components.map(row =>
        new ActionRowBuilder().addComponents(
            row.components.map(button =>
                ButtonBuilder.from(button).setDisabled(true)
            )
        )
    );

    await interaction.message.edit({
        components: disabledRows
    });

    for (const key in colors) {
        const saved = await getColorFromData(key);
        if (!saved) continue;

        const role = interaction.guild.roles.cache.get(saved.id);

        if (role && interaction.member.roles.cache.has(role.id)) {
            await interaction.member.roles.remove(role);
        }
    }

    const saved = await getColorFromData(interaction.customId);

    if (saved) {
       const role = interaction.guild.roles.cache.get(saved.id);

       console.log("Role:", role?.name);
        console.log("Role ID:", saved.id);

       if (!role) {
            console.log("Role not found.");
           return;
       }

       await interaction.member.roles.add(role);
       console.log("Added role.");
    }

    const msg = await interaction.channel.send({
        content: `${interaction.user} changed color to ${color.label}`
    });

    setTimeout(async () => {

        await msg.delete().catch(() => {});
        await interaction.message.delete().catch(() => {});

        await sendColorMenu(interaction.channel);

    }, 5000);
});

client.login(process.env.TOKEN);