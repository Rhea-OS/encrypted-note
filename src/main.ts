import * as obs from 'obsidian';
import SettingsTab from "./settings.js";
import {BaseComponent} from "obsidian";

export interface Settings {

}

export const default_settings: Settings = {};

export type Widget = (ButtonWidget | TextInputWidget | ListBoxWidget) & {
    id?: WidgetId,
    label?: string,
    description?: string,
};

export type ButtonWidget = {
    text: string,
    icon?: string,
    onClick: (e: MouseEvent) => void,
};

export type TextInputWidget = {
    getTextContent?: () => string,
    setTextContent?: (text: string) => void,

    placeholder?: string,

    multiline?: boolean
}

export type ListBoxWidget = {
    listItems: () => {
        label: string,
        key?: string
    }[],

    multiple?: boolean,
    extend?: boolean
}

export type WidgetId = string;

export default class Form extends obs.Plugin {

    settingsTab: SettingsTab | null = null;
    settings: Settings = default_settings;

    widgets: Map<WidgetId, { widget: Widget, component: obs.BaseComponent }> = new Map();
    updateHooks: Array<() => void> = [];

    async onload() {
        const self = this;
        this.registerMarkdownCodeBlockProcessor("form-control", function (source, el, ctx) {
            try {
                const getId = (widget: Widget): WidgetId => `${self.app.workspace.getActiveFile()?.path ?? '/'}/${widget.id ?? self.widgets.size}`;

                let form;
                const widget = new Function("form", source)(form = {
                    createButton(widget: Widget & ButtonWidget) {
                        const id = getId(widget);
                        new obs.Setting(el)
                            .addButton(button => {
                                self.widgets.set(id, {
                                    widget,
                                    component: button
                                });

                                button.setButtonText(widget.text);
                                if (widget.icon) button.setIcon(widget.icon);

                                button.onClick(e => widget.onClick?.(e));
                            })
                            .setName(widget.label ?? '')
                            .setDesc(widget.description ?? '');
                    },
                    createTextWidget(widget: Widget & TextInputWidget) {
                        const id = getId(widget);
                        const cb = function (input: obs.TextComponent | obs.TextAreaComponent) {
                            self.widgets.set(id, {
                                widget,
                                component: input
                            });

                            if (widget.getTextContent) input.setValue(String(widget.getTextContent()));
                            input.onChange(value => {
                                widget.setTextContent?.(value);
                                self.updateHooks.forEach(i => i());
                            });

                            if (widget.getTextContent && !widget.setTextContent) {
                                input.setDisabled(true);
                                self.updateHooks.push(() => void input.setValue(String(widget.getTextContent!())))
                            }
                        };

                        (widget.multiline ? new obs.Setting(el)
                            .addTextArea(cb) : new obs.Setting(el).addText(cb))
                            .setName(widget.label ?? '')
                            .setDesc(widget.description ?? '');
                    },
                    query(id: WidgetId): BaseComponent | null {
                        if (self.widgets.has(id))
                            return self.widgets.get(id)!.component;

                        const new_id = `${self.app.workspace.getActiveFile()?.path ?? '/'}/${id}`;

                        if (self.widgets.has(new_id))
                            return self.widgets.get(new_id)!.component;

                        return null;
                    }
                });
            } catch (err) {
                el.createEl("pre", {
                    cls: ["error"],
                    text: String(err instanceof Error ? err.stack : err)
                })
            }
        });
        this.addSettingTab(new SettingsTab(this.app, this));
    }
}