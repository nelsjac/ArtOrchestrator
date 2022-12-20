import got from 'got';
import config from '../config.js';


const getRandomObjects = async (query = {size: 10}) => {
    const results = await got.get({
        url: `https://${config.repositories.miaBaseUrl}/random/art`,
        searchParams: query
      }
    ).json();

    return results;
}

const getObject = async (objectId) => {
    const result = await got.get({
        url: `https://${config.repositories.miaBaseUrl}/id/${objectId}`,
      }
    ).json();

    return result;
}

const getObjects = async (objectIds) => {
    const results = await got.get({
        prefixUrl: config.repositories.miaBaseUrl,
        url: `ids/${objectIds}`,
      }
    ).json();

    return results;
}

const searchObjects = async (query) => {
    const results = await got.get({
        url: config.repositories.miaBaseUrl,
        searchParams: encodeURIComponent(query)
      }
    ).json();

    return results;
}

export default {
    getRandomObjects,
    getObject,
    getObjects,
    searchObjects
}