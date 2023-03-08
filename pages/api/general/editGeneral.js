// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");
import { Double } from "mongodb";


export default async function handler(req, res) {
    let client = await DbConnection.Get()
    let db = client.db(req.body.id)
    let doc = await db.collection('Guild Settings').findOne({
        Name: "General Settings"
    })
    let data = req.body.data
    console.log(data);
    if(doc && data){
        await db.collection('Guild Settings').updateOne({
            Name: "General Settings"
        }, {
            $set: {
                "Exchange Rate": data.exchangeRate ? new Double(parseFloat(data.exchangeRate)) : doc['Exchange Rate'],
                "Max Offenses": parseInt(data.maxOffenses) || doc['Max Offenses'],
                "Exchange Bonus": data.exchangeBonus ? new Double(parseFloat(data.exchangeBonus)) : doc['Exchange Bonus'],
                "Offenses Bonus": data.offensesBonus ? new Double(parseFloat(data.offensesBonus)) : doc['Offenses Bonus'],
                "Points Bonus": data.pointsBonus ? new Double(parseFloat(data.pointsBonus)) : doc['Points Bonus'],
                "Streak Bonus": data.streakBonus ? new Double(parseFloat(data.streakBonus)) : doc['Streak Bonus'],
                "Buyer 1 Level": parseInt(data.level1Buyer) || doc['Buyer 1 Level'],
                "Buyer 2 Level": parseInt(data.level2Buyer) || doc['Buyer 2 Level'],
                "Buyer 3 Level": parseInt(data.level3Buyer) || doc['Buyer 3 Level'],
                "Boost Time Limit": parseInt(data.boostTimeLimit) || doc['Boost Time Limit'],
                "Automatic Monthly Bonus": data.automaticMonthlyBonus || doc['Automatic Monthly Bonus']
            }
        })
    }
    res.status(200).json({ status: 'success' })
  }
  