const defaultSettings = require('./default_settings.js');

const fs = require('fs');

module.exports = function MigrateSettings(oldVersion, newVersion, settings) {

    if (oldVersion === undefined) {
        return { ...defaultSettings, ...settings };
    } else if (oldVersion === null) {
        return defaultSettings;
    } else if (oldVersion + 0.1 < newVersion) {
        settings = MigrateSettings(oldVersion, oldVersion + 0.1, settings);
        return MigrateSettings(oldVersion + 0.1, newVersion, settings);
    }

    if (newVersion === 1.0) {
        fs.unlinkSync(__dirname + '/../../settings.json');
        return defaultSettings;
    }
};