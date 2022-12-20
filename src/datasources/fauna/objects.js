import config from '../../config.js';
import faunaArtBox from '../fauna.js';

// const insertIfNew
let OBJECTS_COLLECTION = config.fauna.collections.objects;
async function insertObject(obj, id) {
    faunaArtBox.insertOne(OBJECTS_COLLECTION, obj, id)
}

async function getObject(id) {
    faunaArtBox.getById(OBJECTS_COLLECTION, id)

}


const getObjects = async () => {
    
}

const searchObjects = async () => {

}

const updateObject = async () => {

}

const deleteObject = async () => {
    
}

export default {
    insertObject,
    getObject
}