import { Double } from "mongodb";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
  const { storeName, itemNumber} =
    req.body;

  if (storeName && itemNumber) {
    let client = await DbConnection.Get();
    let database = client.db(req.body.id);
    if (database) {
      let store = await database.collection("Stores").findOne({
        Name: storeName
      })
      let items = store.Items
      items.splice(itemNumber,1)
      await database.collection("Stores").updateOne(
        {
          Name: storeName,
        },
        {
          $set: {
           "Items": items
          },
        }
      );
      res.status(200).json({ status: "success" });
    }
  } else {
    res.status(200).json({ status: "failed" });
  }
}
