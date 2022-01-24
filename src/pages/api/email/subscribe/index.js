import getDB from '../../db'
import nodemailer from 'nodemailer'

const { db } = getDB()

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.GMAIL_TOKEN,
    },
    secure: true,
})

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    const { email } = req.body
    if(email) {
        try {
            const subscriber = {
                email,
                is_subscribed: true
            }
            const test = await db`
                insert into subscribers ${
                    db(subscriber, 'email', 'is_subscribed')
                }
                returning *
            `


            const mailData = {
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: `Thanks for Subscribing!`,
                html: `<div>Thanks for Subscribing to my blog</div>`
            }

            transporter.sendMail(mailData, (err, info) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info)
                }      
            })
    
            return res.status(200).json({
                email: req.body.email,
                message: "Successfully subscribed"
            })
        } catch (e) {
            if(e.constraint = 'email unqiue') {
                return res.status(200).json({
                    email: req.body.email,
                    message: "User already tried subscribed"
                })
            }
            console.warn({e})
        }
        
    }

    return res.status(500)
}

export default handler;