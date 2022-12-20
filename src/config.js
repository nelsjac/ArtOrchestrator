const config = {
    repositories: {
        miaBaseUrl: 'search.artsmia.org',
        gettyVocabUrl: 'vocabsservices.getty.edu'
    },
    fauna: {
        domain: 'db.us.fauna.com',
        secret: process.env.FAUNADB_SECRET || "",
        collections: {
            repositories: 'repositories',
            objects: 'objects',
            constituents: 'constituents'
        }
    },
    lruCache: {
        options: {
            max: 500,
            ttl: 1000 * 60 * 60, // lifespan in ms: 60 minutes
            allowStale: true
        }
    }
}

export default config;