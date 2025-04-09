"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  ENCRYPTED_NOTE_VIEW: () => ENCRYPTED_NOTE_VIEW,
  default: () => EncryptedNote,
  default_settings: () => default_settings
});
module.exports = __toCommonJS(main_exports);
var obs3 = __toESM(require("obsidian"), 1);

// src/settings.ts
var obs = __toESM(require("obsidian"), 1);
var SettingsTab = class extends obs.PluginSettingTab {
  display() {
  }
};

// src/passwordPrompt.ts
var obs2 = __toESM(require("obsidian"), 1);
var PasswordPrompt = class _PasswordPrompt extends obs2.Modal {
  constructor(app, file, onSubmit) {
    super(app);
    this.setTitle(`Decrypt ${file.name}`);
    const form = this.contentEl.createEl("form", {});
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      onSubmit(e.target.password.value);
      this.close();
    });
    new obs2.Setting(form).setName("Password").setDesc("Please enter the password to unlock this note.").addText((text) => Object.assign(text.inputEl, {
      type: "password",
      name: "password",
      placeholder: "abc123"
    }));
    form.createEl("button", {
      type: "submit",
      text: "Okay"
    });
  }
  static async prompt(app, file) {
    return await new Promise((ok) => new _PasswordPrompt(app, file, (pw) => ok(pw)).open());
  }
};

// src/main.ts
var ENCRYPTED_NOTE_VIEW = "encrypted-note-view";
var default_settings = {
  iv: window.crypto.getRandomValues(new Uint8Array(16))
};
var EncryptedNote = class extends obs3.Plugin {
  settingsTab = null;
  settings = default_settings;
  async onload() {
    this.registerExtensions(["enc"], "markdown");
    this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => menu.addItem((item) => item.setTitle("Encrypt Note").setIcon("lock").onClick(async (_) => {
      const pw = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(await PasswordPrompt.prompt(this.app, file)));
      const key = await window.crypto.subtle.importKey("raw", pw, "AES-GCM", false, ["encrypt", "decrypt"]);
      const path = this.app.vault.getFileByPath(file.path);
      if (!path)
        return new obs3.Notice("File could not be found.");
      const cipher = await window.crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: this.settings.iv
      }, key, await this.app.vault.readBinary(path));
      await this.app.vault.rename(file, `${file.path}.enc`);
    }))));
    this.registerEvent(this.app.workspace.on("file-open", async (file) => {
      if (file?.extension != "enc") return;
      console.log("Encrypted file");
    }));
    this.addSettingTab(new SettingsTab(this.app, this));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ENCRYPTED_NOTE_VIEW,
  default_settings
});
//# sourceMappingURL=main.js.map
