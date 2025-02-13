import * as obs from 'obsidian';
import SettingsTab from "./settings.js";
export const default_settings = {};
export default class Form extends obs.Plugin {
    settingsTab = null;
    settings = default_settings;
    widgets = new Map();
    updateHooks = [];
    async onload() {
        const self = this;
        this.registerMarkdownCodeBlockProcessor("form-control", function (source, el, ctx) {
            try {
                const getId = (widget) => `${self.app.workspace.getActiveFile()?.path ?? '/'}/${widget.id ?? self.widgets.size}`;
                let form;
                const widget = new Function("form", source)(form = {
                    createButton(widget) {
                        const id = getId(widget);
                        new obs.Setting(el)
                            .addButton(button => {
                            self.widgets.set(id, {
                                widget,
                                component: button
                            });
                            button.setButtonText(widget.text);
                            if (widget.icon)
                                button.setIcon(widget.icon);
                            button.onClick(e => widget.onClick?.(e));
                        })
                            .setName(widget.label ?? '')
                            .setDesc(widget.description ?? '');
                    },
                    createTextWidget(widget) {
                        const id = getId(widget);
                        const cb = function (input) {
                            self.widgets.set(id, {
                                widget,
                                component: input
                            });
                            if (widget.getTextContent)
                                input.setValue(String(widget.getTextContent()));
                            input.onChange(value => {
                                widget.setTextContent?.(value);
                                self.updateHooks.forEach(i => i());
                            });
                            if (widget.getTextContent && !widget.setTextContent) {
                                input.setDisabled(true);
                                self.updateHooks.push(() => void input.setValue(String(widget.getTextContent())));
                            }
                        };
                        (widget.multiline ? new obs.Setting(el)
                            .addTextArea(cb) : new obs.Setting(el).addText(cb))
                            .setName(widget.label ?? '')
                            .setDesc(widget.description ?? '');
                    },
                    query(id) {
                        if (self.widgets.has(id))
                            return self.widgets.get(id).component;
                        const new_id = `${self.app.workspace.getActiveFile()?.path ?? '/'}/${id}`;
                        if (self.widgets.has(new_id))
                            return self.widgets.get(new_id).component;
                        return null;
                    }
                });
            }
            catch (err) {
                el.createEl("pre", {
                    cls: ["error"],
                    text: String(err instanceof Error ? err.stack : err)
                });
            }
        });
        this.addSettingTab(new SettingsTab(this.app, this));
    }
}
//# sourceMappingURL=main.js.map