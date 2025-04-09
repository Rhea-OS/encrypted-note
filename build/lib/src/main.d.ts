import * as obs from 'obsidian';
import SettingsTab from "./settings.js";
export interface Settings {
    iv: Uint8Array<ArrayBuffer>;
}
export declare const ENCRYPTED_NOTE_VIEW = "encrypted-note-view";
export declare const default_settings: Settings;
export default class EncryptedNote extends obs.Plugin {
    settingsTab: SettingsTab | null;
    settings: Settings;
    onload(): Promise<void>;
}
