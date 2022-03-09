import createSingleton from './utils/createSingleton';
const postgres = require('postgres')

const dev = process.env.NODE_ENV !== "production";

const getDB = () => {
    return createSingleton('postgres-db', () => {
        return {
            db: postgres(process.env.POSTGRES_PROD_URL, {
                ...(dev && {ssl: {rejectUnauthorized: false}})
            })
        }
    })  
}

export default getDB