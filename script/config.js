'use strict';
// Loads, validates, and provides config values
const { Validator } = require('jsonschema');
var fse = require('fs-extra');

// TODO: Create empty config files if not found

const configs = ['discord', 'socket'];
let config = {};

configs.forEach(c => {
    let schema = require(`./../config/${c}-config-schema.json`);
    let loadedConfig;
    try {
        loadedConfig = require(`./../config/${c}-config.json`);
    } catch(e) {
        console.error(`Error loading ${c} config file, check that ${c}-config.json exists in root directory and contains valid JSON`);
        process.exit();
    }
    let validation = new Validator().validate(loadedConfig, schema);
    if(validation.errors.length > 0) {
        console.error(`${c} config validation failed, see errors below:`);
        for(let e = 0; e < validation.errors.length; e++) {
            console.error('Error #' + (e+1), validation.errors[e].property, validation.errors[e].message);
        }
        console.error('To view the config schemas, look in the script folder');
        process.exit(); // Exit if config does not validate
    }
    config[c] = loadedConfig;
});

let saving = false;

module.exports = {
    get: file => config[file],
    write: (file, data) => {
        if(saving) return;
        saving = true;
        let filename = `./config/${file}-config.json`;
        setTimeout(() => { // Multiple saves called at once will collapse into a single save
            fse.writeJson(filename + '.tmp', data, { spaces: 2 })
                .then(() => {
                    fse.move(filename + '.tmp', filename, { overwrite: true })
                        .then(() => saving = false)
                        .catch(err => {
                            console.error('Error writing to file', filename, err);
                            saving = false;
                        });
                })
                .catch(err => console.error('Error saving temporary file', filename + '.tmp', err));
        }, 0);
    }
};
