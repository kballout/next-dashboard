import getBot from "@/utils/bot";
import { ChannelType, PermissionsBitField } from "discord.js";
import { Double } from "mongodb";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
  const { name, level, icon } = req.body;
  if (name && level) {
    let client = await DbConnection.Get();
    let database = client.db(req.body.id);
    if (database) {
      let client = await getBot();
      await client.guilds.fetch();
      let guild = client.guilds.cache.get(req.body.id);
      await guild.roles.fetch();
      //create role
      let role = await guild.roles.create({
        name: name + " Buyer",
        color: "Blue",
      });
      let adminID = guild.roles.cache.find((r) => r.name === "Game Admin").id;
      let category = guild.channels.cache.find(
        (c) => c.name === "MMO Stores" && c.type === ChannelType.GuildCategory
      );
      //Create channel
      let channel = await guild.channels.create({
        type: ChannelType.GuildText,
        name: name,
        parent: category,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
          {
            id: adminID,
            deny: [
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.ManageMessages,
            ],
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.AddReactions,
            ],
          },
          {
            id: role.id,
            deny: [
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ManageMessages,
            ],
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.AddReactions,
            ],
          },
        ],
      });
      let doc = {
        Name: name,
        Icon: icon,
        "Level Required": level,
        ID: channel.id,
        "Role ID": role.id,
        Options: [],
        Items: [
          {
            Number: 1,
            Name: "",
            Qty: 0,
            Cost: new Double(0),
            Available: false,
          },
          {
            Number: 2,
            Name: "",
            Qty: 0,
            Cost: new Double(0),
            Available: false,
          },
          {
            Number: 3,
            Name: "",
            Qty: 0,
            Cost: new Double(0),
            Available: false,
          },
        ],
      };
      database.collection("Stores").insertOne(doc);
      res.status(200).json({ status: "success" });
    }
  } else {
    res.status(200).json({ status: "failed" });
  }
}
