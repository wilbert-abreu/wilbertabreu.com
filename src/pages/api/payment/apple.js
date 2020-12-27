import fs from "fs";
import path from 'path';
import whitelistedUrls from './whitelistedUrls'


const handler = async (req, res) => {
    // req.query
    // req.cookies
    // req.body
    if (req.method === 'POST') {
        const url = req.body.url;

        if(whitelistedUrls[url]) {
            try {
                const cert = fs.readFileSync(path.resolve('src/pages/api/payment', `./merchant_id.cer`), "utf8");

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
                const request = await fetch(url, options)
                const session = await request.json();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(session));
            } catch (error) {
                console.warn({error})
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error }));
            }
        }

        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Apple Url Not found in whitelist" , url}));
    } else {
        console.warn('api/ routes get')
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ test: 'failed' }));
    }
}

export default handler