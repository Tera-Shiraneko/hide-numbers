const SettingsInterface = require('tera-mod-ui').Settings;
const settingsStructure = require('./Additional-Data/Module-Settings/settings_structure.js');

module.exports = function HideNumbers(mod) {

    if (mod.proxyAuthor !== 'caali' || !mod.clientInterface) {
        mod.warn('Pinkie Pie made a big mistake at the 25th April 2020 therefore I decided to drop every kind of support.');
        mod.warn('You can now either use this module on Tera Toolbox or delete it.');
        mod.warn('The latest version of Tera Toolbox can be downloaded from http://tiny.cc/tera-toolbox-installer.');
        return;
    }

    let userInterface = null;

    let leaveGameCleanup = {};

    mod.command.add('hn', (arg) => {
        if (arg === 'damage') {
            mod.settings.hideDamage = !mod.settings.hideDamage;
            const enabled = 'Hiding of received damage numbers is now enabled.';
            const disabled = 'Hiding of received damage numbers is now disabled.';
            mod.settings.hideDamage ? sendMessage('00ff04', enabled) : sendMessage('ff1d00', disabled);
        } else if (arg === 'hits') {
            mod.settings.hideHits = !mod.settings.hideHits;
            const enabled = 'Hiding of dealt damage numbers is now enabled.';
            const disabled = 'Hiding of dealt damage numbers is now disabled.';
            mod.settings.hideHits ? sendMessage('00ff04', enabled) : sendMessage('ff1d00', disabled);
        } else if (arg === 'heal') {
            mod.settings.hideHeal = !mod.settings.hideHeal;
            const enabled = 'Hiding of health regeneration numbers is now enabled.';
            const disabled = 'Hiding of health regeneration numbers is now disabled.';
            mod.settings.hideHeal ? sendMessage('00ff04', enabled) : sendMessage('ff1d00', disabled);
        } else if (arg === 'mana') {
            mod.settings.hideMana = !mod.settings.hideMana;
            const enabled = 'Hiding of mana regeneration numbers is now enabled.';
            const disabled = 'Hiding of mana regeneration numbers is now disabled.';
            mod.settings.hideMana ? sendMessage('00ff04', enabled) : sendMessage('ff1d00', disabled);
        } else if (arg === 'ui') {
            handleUserInterface('show');
        }
        handleUserInterface('update');
    });

    mod.hook('S_EACH_SKILL_RESULT', 14, (event) => {
        if (mod.settings.hideDamage && mod.game.me.is(event.target) && event.type === 1) {
            event.type = 0;
            return true;
        } else if (mod.settings.hideHits && !mod.game.me.is(event.target) && event.type === 1) {
            event.type = 0;
            return true;
        }
    });

    mod.hook('S_CREATURE_CHANGE_HP', 6, (event) => {
        if (mod.settings.hideHeal && mod.game.me.is(event.target) && event.type != 10) {
            event.type = 10;
            return true;
        }
    });

    mod.hook('S_PLAYER_CHANGE_MP', 1, (event) => {
        if (mod.settings.hideMana && mod.game.me.is(event.target) && event.type != 0) {
            event.type = 10;
            return true;
        }
    });

    mod.game.on('leave_game', leaveGameCleanup = () => handleUserInterface('close'));

    function sendMessage(color, text) {
        const silentMode = mod.manager.get('command').settings.silent_mode;
        if (silentMode) {
            mod.command.message(`${text}`);
        } else {
            mod.command.message(`<font color='#${color}'>${text}</font>`);
        }
    }

    if (global.TeraProxy.GUIMode) {
        userInterface = new SettingsInterface(mod, settingsStructure, mod.settings, {
            alwaysOnTop: true,
            width: 500,
            height: 199
        });
        userInterface.on('update', (settings) => mod.settings = settings);
    }

    function handleUserInterface(decision) {
        if (!userInterface) return;
        if (decision === 'show') {
            userInterface.show();
        } else if (decision === 'update') {
            userInterface.update(mod.settings);
        } else if (decision === 'close') {
            userInterface.close();
        } else if (decision === 'clear') {
            userInterface.close();
            userInterface = null;
        }
    }

    this.destructor = () => {
        handleUserInterface('clear');
        mod.game.removeListener('leave_game', leaveGameCleanup);
        mod.command.remove('hn');
    };
};