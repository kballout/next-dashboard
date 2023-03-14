import getBot from "@/utils/bot";
import { ChannelType, EmbedBuilder, PermissionsBitField } from "discord.js";
import { Double } from "mongodb";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
  const { type, cost } = req.body;
  if (type) {
    let client = await DbConnection.Get();
    let database = client.db(req.body.id);
    if (database) {
      let client = await getBot();
      await client.guilds.fetch();
      let guild = client.guilds.cache.get(req.body.id);
      //start event
      if (type === "start") {
        await database.collection("Guild Settings").updateOne(
          {
            Name: "General Settings",
          },
          {
            $set: {
              "World Event.Status": true,
              "World Event.Cost": new Double(cost),
            },
          }
        );
        await guild.channels.fetch();
        let channel = guild.channels.cache.find(
          (ch) => ch.name === "bot-messages"
        );
        let embed = new EmbedBuilder()
          .setColor("DarkGreen")
          .setTitle("World Event")
          .setDescription(
            "@everyone The world event has been started. All players must cooperatively work together to unlock it for a reward. Players can help by using the /donate command. Good Luck!"
          )
          .setTimestamp();

        channel.send({ embeds: [embed] });
        res.status(200).json({ status: "success" });
      } else {
        await database.collection("Guild Settings").updateOne(
          {
            Name: "General Settings",
          },
          {
            $set: {
              "World Event.Status": false,
              "World Event.Cost": new Double(0),
            },
          }
        );
        await guild.channels.fetch();
        let channel = guild.channels.cache.find(
          (ch) => ch.name === "bot-messages"
        );
        let embed = new EmbedBuilder()
          .setColor("DarkGreen")
          .setTitle("World Event")
          .setDescription("@everyone The world event has ended.")
          .setTimestamp();

        channel.send({ embeds: [embed] });
        res.status(200).json({ status: "success" });
      }
    }
  } else {
    res.status(200).json({ status: "failed" });
  }
}
