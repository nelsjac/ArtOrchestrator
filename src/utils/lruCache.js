import config from '../config.js';
import LRU from 'lru-cache';

let _cache;

/**
 * Create a new LRUCache.
 * @param {object} options 
 */
function init(options) {
    _cache = new LRU(options);
} 

/**
 * Return a value from the cache.
 * @param {string} key 
 * @returns 
 */
function get(key) {
    return _cache.get(key);
}

/**
 * Add a value to the cache.
 * @param {string} key 
 * @param {*} value 
 * @returns 
 */
function set(key, value) {
    _cache.set(key, value);
    return value;
}
/**
 * 
 * @param {string} key 
 * @returns {boolean}
 */
function del(key) {
    return _cache.del(key);
}

/**
 * Clear the cache entirely, throwing away all values.
 */
function cleanup() {
    _cache.clear();
}

export default {
    init,
    get,
    set,
    del,
    cleanup
}