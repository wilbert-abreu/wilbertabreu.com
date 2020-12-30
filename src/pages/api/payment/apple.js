import https from 'https';
import whitelistedUrls from './whitelistedUrls'
import cert from './apple-pay-cert.pem'

const handler = async (req, res) => {
    // req.query
    // req.cookies
    // req.body
    if (req.method === 'POST') {
        const url = req.body.url;

        if(whitelistedUrls[url]) {
            try {
                const options = {
                    cert: cert,
                    key: cert
                };
                const request = await fetch(url, {
                  mode: 'cors',
                  method: 'POST',
                  body: JSON.stringify({
                      merchantIdentifier: 'merchant.com.wilbertabreu',
                      domainName: 'wilbertabreu.com',
                      displayName: 'merchant.com.wilbertabreu'
                  }),
                  credentials: 'include',
                  header: {
                      'Content-Type': 'application/json'
                  },
                  agent: new https.Agent(options)
                })
                const session = await request.json();
                return res.status(200).json(session)
            } catch (error) {
                console.warn({error})
                return res.status(500).json({ error: { ...error, statusCode: res.statusCode, stackTrace: error.stack } })
            }
        }
        res.status(500).json({ error: "Apple Url Not found in whitelist" , url})
    } else {
        res.status(500).json({ test: 'Only accepts Post requests' })
    }
}

export default handler
