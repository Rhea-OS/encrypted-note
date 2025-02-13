import * as obs from 'obsidian';
import SettingsTab from "./settings.js";
export interface Settings {
}
export declare const default_settings: Settings;
export type Widget = (ButtonWidget | TextInputWidget | ListBoxWidget) & {
    id?: WidgetId;
    label?: string;
    description?: string;
};
export type ButtonWidget = {
    text: string;
    icon?: string;
    onClick: (e: MouseEvent) => void;
};
export type TextInputWidget = {
    getTextContent?: () => string;
    setTextContent?: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
};
export type ListBoxWidget = {
    listItems: () => {
        label: string;
        key?: string;
    }[];
    multiple?: boolean;
    extend?: boolean;
};
export type WidgetId = string;
export default class Form extends obs.Plugin {
    settingsTab: SettingsTab | null;
    settings: Settings;
    widgets: Map<WidgetId, {
        widget: Widget;
        component: obs.BaseComponent;
    }>;
    updateHooks: Array<() => void>;
    onload(): Promise<void>;
}
