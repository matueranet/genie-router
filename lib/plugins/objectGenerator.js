
const Storage = require('../storage');
/**
 * Generates the router object that plugins receive, scoped if needed on the pluginName.
 * The router object will contain generic router functions.
*/
function objectGenerator(config, pluginName) {
    const storage = new Storage(config);
    return {
        storage: {
            get(key, defaultVal) {
                return storage.get(`${pluginName}.${key}`, defaultVal);
            },
            put(key, value) {
                return storage.put(`${pluginName}.${key}`, value);
            },
        },
    };
}

module.exports = objectGenerator;
