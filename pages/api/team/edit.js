import { Double } from "mongodb";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
  const { points, flag, team } = req.body;
  if (team && (points || flag)) {
    let client = await DbConnection.Get();
    let database = client.db(req.body.id);
    if (database) {
      if (points && flag) {
        await database.collection("Teams").updateOne(
          {
            Name: team,
          },
          {
            $set: {
              Points: new Double(points),
              "Team Flag": flag,
            },
          }
        );
      } else if (points) {
        await database.collection("Teams").updateOne(
          {
            Name: team,
          },
          {
            $set: {
              Points: new Double(points),
            },
          }
        );
      } else if (flag) {
        await database.collection("Teams").updateOne(
          {
            Name: team,
          },
          {
            $set: {
              "Team Flag": flag,
            },
          }
        );
      }
      res.status(200).json({ status: "success" });
    }
  } else {
    res.status(200).json({ status: "failed" });
  }
}
