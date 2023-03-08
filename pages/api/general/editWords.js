// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
    let client = await DbConnection.Get()
    let db = client.db(req.body.id)
    let doc = {}
    for (let i = 0; i < req.body.words.length; i++) {
        doc[i] = req.body.words[i]
    }
    await db.collection('Guild Settings').updateOne({
        Name: "General Settings"
    }, {
        $set: {
            "Bad Words List.words": doc
        }
    })
    res.status(200).json({ status: 'success' })
  }
  