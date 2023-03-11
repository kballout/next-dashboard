import { Double } from "mongodb";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
  const { storeName, itemNumber, itemName, itemQty, itemCost, itemAvailable } =
    req.body;

  if (storeName && itemNumber) {
    let client = await DbConnection.Get();
    let database = client.db(req.body.id);
    if (database) {
      let store = await database.collection("Stores").findOne({
        Name: storeName,
      });
      if (store) {
        let items = Object.values(store.Items);
        let newItems = {}
        for (let i = 0; i < items.length; i++) {
            newItems[`Item`]: {
                Number: itemNumber
            }
            
        }
        for (const item of items) {
          if (item.Number === itemNumber) {
            newItems.push({
                "Number": itemNumber,
                Name: itemName,
                Qty: itemQty,
                Cost: new Double(itemCost),
                Available: itemAvailable
            })
          } else {
            newItems.push(item)
          }
        }
        console.log(newItems);
        await database.collection("Stores").updateOne({
            Name: storeName
        }, {
            $set: {
                "Items": newItems
            }
        })
        res.status(200).json({ status: "success" });
      }
    }
  } else {
      res.status(200).json({ status: "failed" });
  }
}
