import getDB from '../../db'

const { db } = getDB()

const handler = async (req, res) => {  
    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }
    
    const { email } = req.body
    if(email) {
        // console.warn({sql: `${pgp.helpers.update({ is_subscribed: "false" }, ['is_subscribed'], 'subscribers')} WHERE "email" = "${email}";`})

        const subscriber = {
            is_subscribed: false
        }

        await db`
            update subscribers ${
                db(subscriber, 'is_subscribed')
            } where 
            email = ${email}
        `
        
        // await db.one(`${pgp.helpers.update({ is_subscribed: false }, ['is_subscribed'], 'subscribers')} WHERE email = '${email}';`);
        
        return res.status(200).json({
            email: req.body.email
        })
    }

    return res.status(500)
}

export default handler;