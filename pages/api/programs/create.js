import { Double } from "mongodb";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
  const { name, factor, type, amount } =
    req.body;

  if (name) {
    let client = await DbConnection.Get();
    let database = client.db(req.body.id);
    if (database) {
      let progs = await database.collection("Guild Settings").findOne({
        Name: "Program IDs"
      })
      let path = `Programs.Program ${progs['Total Programs'] + 1}`
      await database.collection("Guild Settings").updateOne({
        Name: "Program IDs"
      }, {
        $set: {
            [path]: {
                Name: name,
                Factor: new Double(factor),
                Count: 0,
                "Bonus Type": type,
                "Bonus Amount": new Double(amount)
            }
        }
      })
      await database.collection("Guild Settings").updateOne({
        Name: "Program IDs"
      }, {
        $set: {
            "Total Programs": progs['Total Programs'] + 1
        }
      })
      res.status(200).json({ status: "success" });
    }
  } else {
    res.status(200).json({ status: "failed" });
  }
}
