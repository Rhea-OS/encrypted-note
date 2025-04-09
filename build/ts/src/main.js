import * as obs from 'obsidian';
import SettingsTab from "./settings.js";
import PasswordPrompt from "./passwordPrompt.js";
export const ENCRYPTED_NOTE_VIEW = 'encrypted-note-view';
export const default_settings = {
    iv: window.crypto.getRandomValues(new Uint8Array(16))
};
export default class EncryptedNote extends obs.Plugin {
    settingsTab = null;
    settings = default_settings;
    async onload() {
        this.registerExtensions(['enc'], 'markdown');
        this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => menu
            .addItem(item => item
            .setTitle("Encrypt Note")
            .setIcon("lock")
            .onClick(async (_) => {
            const pw = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(await PasswordPrompt.prompt(this.app, file)));
            const key = await window.crypto.subtle.importKey('raw', pw, 'AES-GCM', false, ['encrypt', 'decrypt']);
            const path = this.app.vault.getFileByPath(file.path);
            if (!path)
                return new obs.Notice("File could not be found.");
            const cipher = await window.crypto.subtle.encrypt({
                name: 'AES-GCM',
                iv: this.settings.iv,
            }, key, await this.app.vault.readBinary(path));
            await this.app.vault.rename(file, `${file.path}.enc`);
        }))));
        this.registerEvent(this.app.workspace.on("file-open", async (file) => {
            if (file?.extension != 'enc')
                return;
            console.log('Encrypted file');
        }));
        this.addSettingTab(new SettingsTab(this.app, this));
    }
}
//# sourceMappingURL=main.js.map