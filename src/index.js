
import lruCache from './utils/lruCache.js';
import parser from './utils/xmlParser.js';
import dataExtractor from './controllers/dataExtractor.js';
import config from './config.js';
import fauna from './datasources/fauna.js';

const initialize = async () => {
    lruCache.init(config.lruCache.options)
    parser.init();
    fauna.init();
}

const cleanUp = async () => {
    lruCache.cleanup();
}

const main = async () => {
    await initialize();
    // let randomObject = await miaRepo.getRandomObjects({size: 1});
    // randomObject = miaMapper.toArtBoxSchema(randomObject);
    // console.log(JSON.stringify(randomObject, null, 2));
    dataExtractor.start();

    await cleanUp();
}

main();