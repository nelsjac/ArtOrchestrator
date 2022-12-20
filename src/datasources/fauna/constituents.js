import config from '../../config.js';
import faunaArtBox from '../fauna.js';

// const insertIfNew
let CONSTITUENTS_COLLECTION = config.fauna.collections.constituents;
async function insertConstituent(constituent, id) {
    return faunaArtBox.insertOne(CONSTITUENTS_COLLECTION, constituent, id)
}

async function getConstituent(id) {
    return faunaArtBox.getObjectById(CONSTITUENTS_COLLECTION, id)
}


const getConstituents = async () => {
    
}

const searchConstituents = async () => {

}

const updateConstituent = async () => {

}

const deleteConstituent = async () => {
    
}

export default {
    insertConstituent,
    getConstituent
}