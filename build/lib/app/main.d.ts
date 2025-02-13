import * as obs from 'obsidian';
import SettingsTab from "./settings.js";
export interface Settings {
}
export declare const default_settings: Settings;
export default class Form extends obs.Plugin {
    settingsTab: SettingsTab | null;
    settings: Settings;
    onload(): Promise<void>;
}
