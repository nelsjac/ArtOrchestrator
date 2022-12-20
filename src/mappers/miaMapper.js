import faunadb from 'faunadb';
const {Get, Ref, Collection} = faunadb.query;
import hash from "../utils/cyrb53.js";
import config from '../config.js';


const MIA_OBJECT_URL = 'search.artsmia.org/id';

const getConstituents = (artObject) => {
    return artObject.artist !== '' ? mapConstituents(artObject.artist) : null
};

const toArtBoxSchema = (artObject) => {
    return {
        id: hash.cyrb53(`mia${artObject.id}`),
        repository: Ref(Collection(config.fauna.collections.repositories), '335832606757093444'),
        title: artObject.title?.trim(),
        medium: artObject.medium?.trim(),
        classification: artObject.classification?.trim(),
        genre: null,
        movement: null, 
        period: artObject.style?.trim(),
        culture: artObject.culture?.trim() || null,
        // constituents: artObject.artist !== '' ? mapConstituents(artObject.artist) : null,
        creditText: artObject.creditline?.trim(),
        sourceMetadata: {
            sourceId: artObject.id,
            accessionNumber: artObject.accession_number,
            accessionYear: null,
            sourceUrl: `${MIA_OBJECT_URL}/${artObject.id}`,
            department: artObject.department?.trim(),
            roomNumber: artObject.room?.trim(),
            restrictions: artObject.restricted == 0 ? false : true,
            curatorApproved: artObject.curator_approved == 0 ? false : true,
        },
        publicAccess: artObject.public_access == 0 ? false : true,
        publicDomain: artObject.rights_type.toLowerCase() === "Public Domain".toLowerCase() ? true : false,
        objectRights: artObject.rights_type,
        imageRights: artObject.image_copyright,
        images: artObject.image === 'valid' ? 
            [
                {
                    url: `${artObject.id%7}.api.artsmia.org/400/${artObject.id}.jpg`,
                    iiif: false,
                    type: 'small'
                }, {
                    url: `${artObject.id%7}.api.artsmia.org/800/${artObject.id}.jpg`,
                    iiif: false,
                    type: 'medium'
                }
            ] 
            : null, 
        dimensionText: artObject.dimension,
        measurements: null
        //[
            // {
            //     type: Overall,
            //     description: null,
            //     dimensions: {
            //         height: 118.4,
            //         width: 47.6,
            //         unit: in | cm | ft | m
            //     }
            // }
        //]
        ,
        provenanceText: artObject.provenance?.trim(),
        descriptionText: artObject.description?.trim(),
        secondaryText: artObject.text?.trim(),
        geodata: {
            city: null,
            state: null,
            country: artObject.country?.trim(),
            region: null,
            subregion: null,
            continent: artObject.continent?.trim()
        }, 
        // tags: [
        // {
        //         term: Birds,
        //         AAT_URL: http://vocab.getty.edu/page/aat/300266506,
        //         Wikidata_URL: https://www.wikidata.org/wiki/Q5113
        //     }
        // ]
    }
}

// Mia artist field example: "Artist: Vincent van Gogh; Publisher: Time Magazine"
const mapConstituents = (miaArtistField) => {
    const constituents = [];
    const artists = miaArtistField.split(';');
    for(const artist of artists) {
        try {
            const artistParts = artist.split(':');
            const role = artistParts[0].trim();
            const name = artistParts[1].trim();
            const id = hash.cyrb53(`${role}${name}`);
            constituents.push({role, name, id})  
        } catch (error) {
            console.error(error);
        }
    }

    return constituents;
}

export default {
    toArtBoxSchema,
    getConstituents
}