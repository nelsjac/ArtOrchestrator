
import {XMLParser} from 'fast-xml-parser';

let _parser = null;

/**
 * Create a new XML parser.
 * https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md
 * @param {object} options 
 */
function init(options) {
    _parser = new XMLParser(options);
} 

/**
 * Parse an XML string into JS object.
 * @param {string} xmlData 
 * @returns {object}
 */
function parse(xmlData) {
    if(_parser) {
        return _parser.parse(xmlData)
    } else {
        throw new Error('XML Parser has not been initialized.')
    }
}

export default {
    init,
    parse
}
