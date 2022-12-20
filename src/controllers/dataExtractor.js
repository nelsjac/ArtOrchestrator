import miaRepo from '../repositories/mia.js';
import miaMapper from '../mappers/miaMapper.js';
import ulan from '../repositories/ulan.js';
import lruCache from '../utils/lruCache.js';
import xmlParser from '../utils/xmlParser.js';
import constituentsColl from '../datasources/fauna/constituents.js';
import objectsColl from '../datasources/fauna/objects.js'
import leven from 'leven';
import config from '../config.js'

import faunadb from 'faunadb';
const {Ref, Collection} = faunadb.query;
// console.log(await faunaRepo.getRepositories());
// console.log('hello')

// pull 1 random from MIA
async function start () {
    // let miaObject = await miaRepo.getRandomObjects({size: 1});
    const miaObject = await miaRepo.getObject(16116)
    
    // map museum response to ArtBox schema
    let mappedObject = miaMapper.toArtBoxSchema(miaObject);

    // Get Constituents (artists) from art object
    const constituents = miaMapper.getConstituents(miaObject);

    // Fill in artist metadata from Getty
    if(constituents) {
        for(let artist of constituents) {
            const gettyRole = artist.role ? await searchGettyRoles(artist.role) : undefined;
            // const gettyRole = artist.role ? await searchGettyRoles('artist') : undefined;

            const gettyArtist = await searchGettyArtists(artist.name, gettyRole?.list_id)
            // const gettyArtist = await searchGettyArtists('vincent van gogh');
            artist.gettyData = {
                roleTerm: gettyRole?.list_value,
                roleId: gettyRole?.list_id,
                preferredTerm: gettyArtist?.Preferred_Term,
                subjectId: gettyArtist?.Subject_ID,
                preferredBio: gettyArtist?.Preferred_Biography,
                altTerms: gettyArtist?.Term ? [...gettyArtist?.Term] : undefined
            }
        }
    }

    // Insert constituents into DB if not exists
    const constituentRefs = [];
    for(const constituent of constituents) {
        let ref = await constituentsColl.insertConstituent(constituent, constituent.id)
        constituentRefs.push(Ref(Collection(config.fauna.collections.constituents), constituent.id));
    }

    // attach constituents as refs to artObject
    mappedObject.constituents = constituentRefs;

    await objectsColl.insertObject(mappedObject, mappedObject.id);
    console.log(JSON.stringify(mappedObject, null, 2));
}

// using Leven distances to sort array of results based on how similar they are to insput string
function levenify (term, termArr, termArrCompareKey) {
    
    let scores = termArr.map((x) => {return {...x, distance: leven(term, x[termArrCompareKey])}});
    return scores.sort((a, b) => {return a.distance - b.distance});
}

async function searchGettyRoles (term) {
    const cacheHit = lruCache.get(term);
    if(cacheHit) {
        return cacheHit;
    } else {
        const result = await ulan.searchRole(term);
        let resultJson = xmlParser.parse(result);
        let results = resultJson.ArrayOfList_Results.List_Results;
        if(Array.isArray(results) && results.length > 1) {
            results = levenify(term, results, 'list_value');
            return lruCache.set(term, results[0]);
        } else if(results && !Array.isArray(results)) {
            return lruCache.set(term, results);
        } else {
            return null;
        }  
    }
}

async function searchGettyArtists (name, roleId) {
    const cacheHit = lruCache.get(name);
    if(!cacheHit) {
        let result = await ulan.searchArtist(name, roleId);
        let resultJson = xmlParser.parse(result);

        // if no search results returned, search again with default 'Artist' RoleId
        if(resultJson.Vocabulary.Count === 0) {
            result = await ulan.searchArtist(name);
            resultJson = xmlParser.parse(result);
        }
    
        if(resultJson.Vocabulary.Count > 1) {
            resultJson.Vocabulary.Subject = levenify(name, resultJson.Vocabulary.Subject, 'Preferred_Term');
    
            return lruCache.set(name, resultJson.Vocabulary.Subject[0]);
        } else if(resultJson.Vocabulary.Count === 1) {
            return lruCache.set(name, resultJson.Vocabulary.Subject);
        } else {
            return null;
        }  
    } else {
        return cacheHit;
    }
}

export default {
    start
}