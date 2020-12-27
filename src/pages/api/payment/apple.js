
const handler = async (req, res) => {
    // req.query
    // req.cookies
    // req.body
    if (req.method === 'POST') {
        console.warn({url: req.body.url})
        try {
            const request = await fetch(req.body.url, {
                method: 'POST'
            })
            const session = await request.json();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ session }));
        } catch (e) {
            console.warn({e})
            res.end(JSON.stringify({ test: 'failed' }));
        }
    } else {
        console.warn('api/ routes get')
        res.end(JSON.stringify({ test: 'failed' }));
    }
}

export default handler