import config from '../config.js';
import faunadb from 'faunadb';
const q = faunadb.query;

let client;

const init = () => {
    client = new faunadb.Client({ domain: config.fauna.domain, secret: config.fauna.secret })
};

async function getById(collectionName, id) {
    if(client) {
        return client.query(
            q.Get(
                q.Ref(
                    q.Collection(collectionName),
                    id
                )
            )
        ).catch((err) => console.error(
            'Error: [%s] %s: %s',
            err.name,
            err.message,
            err.errors()[0].description,
          ))
    } else {
        console.error('Fauna client not initialized');
    }
}

async function insertOne(collectionName, data, id = null) {
    if(client) {
        let ref = id ? 
            q.Ref(q.Collection(collectionName), id) 
            : q.Collection(collectionName); 

        return client.query(
            q.Create(
                ref,
                { data }
            )
        ).catch((err) => console.error(
            'Error: [%s] %s: %s',
            err.name,
            err.message,
            err.errors()[0].description,
          ))
    } else {
        console.error('Fauna client not initialized');
    }
}


export default {
    getById,
    insertOne,
    init
}