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
  default: () => Form,
  default_settings: () => default_settings
});
module.exports = __toCommonJS(main_exports);
var obs2 = __toESM(require("obsidian"), 1);

// src/settings.ts
var obs = __toESM(require("obsidian"), 1);
var SettingsTab = class extends obs.PluginSettingTab {
  display() {
  }
};

// src/main.ts
var default_settings = {};
var Form = class extends obs2.Plugin {
  settingsTab = null;
  settings = default_settings;
  widgets = /* @__PURE__ */ new Map();
  updateHooks = [];
  async onload() {
    const self = this;
    this.registerMarkdownCodeBlockProcessor("form-control", function(source, el, ctx) {
      try {
        const getId = (widget2) => `${self.app.workspace.getActiveFile()?.path ?? "/"}/${widget2.id ?? self.widgets.size}`;
        let form;
        const widget = new Function("form", source)(form = {
          createButton(widget2) {
            const id = getId(widget2);
            new obs2.Setting(el).addButton((button) => {
              self.widgets.set(id, {
                widget: widget2,
                component: button
              });
              button.setButtonText(widget2.text);
              if (widget2.icon) button.setIcon(widget2.icon);
              button.onClick((e) => widget2.onClick?.(e));
            }).setName(widget2.label ?? "").setDesc(widget2.description ?? "");
          },
          createTextWidget(widget2) {
            const id = getId(widget2);
            const cb = function(input) {
              self.widgets.set(id, {
                widget: widget2,
                component: input
              });
              if (widget2.getTextContent) input.setValue(String(widget2.getTextContent()));
              input.onChange((value) => {
                widget2.setTextContent?.(value);
                self.updateHooks.forEach((i) => i());
              });
              if (widget2.getTextContent && !widget2.setTextContent) {
                input.setDisabled(true);
                self.updateHooks.push(() => void input.setValue(String(widget2.getTextContent())));
              }
            };
            (widget2.multiline ? new obs2.Setting(el).addTextArea(cb) : new obs2.Setting(el).addText(cb)).setName(widget2.label ?? "").setDesc(widget2.description ?? "");
          },
          query(id) {
            if (self.widgets.has(id))
              return self.widgets.get(id).component;
            const new_id = `${self.app.workspace.getActiveFile()?.path ?? "/"}/${id}`;
            if (self.widgets.has(new_id))
              return self.widgets.get(new_id).component;
            return null;
          }
        });
      } catch (err) {
        el.createEl("pre", {
          cls: ["error"],
          text: String(err instanceof Error ? err.stack : err)
        });
      }
    });
    this.addSettingTab(new SettingsTab(this.app, this));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  default_settings
});
//# sourceMappingURL=main.js.map
