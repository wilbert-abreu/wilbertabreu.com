// import fs, { createWriteStream, readFileSync } from "fs";
// import path from 'path';
import whitelistedUrls from './whitelistedUrls'
// const {pipeline} = require('stream');
// const {promisify} = require('util');
import cert from './merchant_id.cer'

// const streamPipeline = promisify(pipeline);


const handler = async (req, res) => {
    // req.query
    // req.cookies
    // req.body
    if (req.method === 'POST') {
        const url = req.body.url;

        if(whitelistedUrls[url]) {
            try {
                // console.warn({readFileSync: readFileSync('./merchant_ids.cer', "utf8")})
                // const certFileResponse = await fetch('https://wilbert-abreu-blog-s3.s3.amazonaws.com/merchant_id.cer')
                // if (!certFileResponse.ok) throw new Error(`unexpected response ${response.statusText}`);
                // console.warn({})
                // await streamPipeline(certFileResponse.body, createWriteStream('./merchant_ids.cer'));
                // fs.existsSync('./merchant_ids.cer')
                // const cert = readFileSync('./merchant_ids.cer', "utf8");
                // console.warn();
                // console.warn({cert})

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
