import fs from "fs";
import whitelistedUrls from './whitelistedUrls'

const cert = fs.readFileSync('./merchant_id.cer');

const handler = async (req, res) => {
    // req.query
    // req.cookies
    // req.body
    if (req.method === 'POST') {
        const url = req.body.url;

        if(whitelistedUrls[url]) {
            const options = {
                cert: cert,
                key: cert,
                method: 'POST',
                body: JSON.stringify({
                    merchantIdentifier: 'merchant.com.wilbertabreu',
                    domainName: 'wilbertabreu.com',
                    displayName: 'merchant.com.wilbertabreu'
                }),
                header: {
                    'Content-Type': 'application/json'
                }
            };

            try {
                const request = await fetch(url, options)
                const session = await request.json();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(session));
            } catch (error) {
                console.warn({error})
                res.statusCode = 500;
                res.end(JSON.stringify({ error }));
            }
        }

        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Apple Url Not found in whitelist" , url}));
    } else {
        console.warn('api/ routes get')
        res.end(JSON.stringify({ test: 'failed' }));
    }
}

export default handler