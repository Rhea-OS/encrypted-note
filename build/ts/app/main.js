import * as obs from 'obsidian';
import SettingsTab from "./settings.js";
export const default_settings = {};
export default class Form extends obs.Plugin {
    settingsTab = null;
    settings = default_settings;
    async onload() {
        this.addSettingTab(new SettingsTab(this.app, this));
    }
}
//# sourceMappingURL=main.js.map