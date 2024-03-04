import { ButtonComponent, Setting, TextComponent, ToggleComponent } from 'obsidian';
import type Settings from '../Settings';

export class ReplacementText {
	constructor(text: TextComponent, settings: Settings, index: number) {
		const initialValue = settings.data.getRule(index)?.replacementText || '';
		text
			.setPlaceholder('Replacement Link')
			.setValue(initialValue)
			.onChange(value => settings.data.updateRuleReplacementText(index, value))
	}
}

export class MatchingText {
	constructor(text: TextComponent, settings: Settings, index: number) {
		const initialValue = settings.data.getRule(index)?.matchingText ?? [];
		text
			.setPlaceholder('Matching,Text')
			.setValue(initialValue.join(','))
			.onChange(value => settings.data.updateRuleMatchingText(index, value))
	}
}

export class RemoveRuleButton {
	constructor(button: ButtonComponent, settings: Settings, index: number) {
		button
			.setIcon('x')
			.onClick(() => {
				settings.data.removeRule(index);
				settings.display();
			});
	}
}

export class AddRuleButton extends Setting {
	constructor(containerEl: HTMLElement, settings: Settings) {
		super(containerEl)
		this.addButton(button =>
			button.setIcon('list-plus')
			.onClick(() => {
				settings.data.addRule();
				settings.display();
			})
		)
	}
}

export class RuleToggle {
	constructor(toggle: ToggleComponent, settings: Settings, index: number) {
		const initialValue = settings.data.getRule(index)?.activated ?? false;
		toggle.setValue(initialValue);
		toggle.onChange(() => {
			settings.data.setRuleActivated(index, toggle.getValue());
		});
	}
}

export class Rule extends Setting {
	constructor(containerEl: HTMLElement, settings: Settings, index: number) {
		super(containerEl)
			this.setClass('settings-rule')
			this.addToggle(toggle => new RuleToggle(toggle, settings, index))
			this.addText(text => new MatchingText(text, settings, index))
			this.addText(text => new ReplacementText(text, settings, index))
			this.addButton(button => new RemoveRuleButton(button, settings, index))
	}
}

export class CustomRulesTitle {
	constructor(containerEl: HTMLElement) {
		const title = containerEl.createEl('h2', { text: "Custom Rules" });
		title.addClass('settings-title')
	}
}