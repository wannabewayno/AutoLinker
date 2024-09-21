import { App, PluginSettingTab } from 'obsidian';
import { CustomRulesTitle, AddRuleButton, Rule } from './Classes';
import SettingsData from './SettingsData';
import Debouncer from '../utils/Debouncer'
import type AutoLinker from "src/index"

export default class Settings extends PluginSettingTab {
	plugin: AutoLinker;
	data: SettingsData;

	constructor(app: App, plugin: AutoLinker) {
		super(app, plugin);
		this.plugin = plugin;
	}

	/**
	 * Called when the user opens the settings tab.
	 */
	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new CustomRulesTitle(containerEl);
		this.data.rules.forEach((_, index) => {
			new Rule(containerEl, this, index);
		});
		new AddRuleButton(containerEl, this);
	}

	/**
	 * Registers itself with the plugin.
	 * Loads data and creates a settings tab for the user to configure.
	 */
	async register() {
		// Load data from disk.
		await this.load();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.plugin.addSettingTab(this);
	}

	async save() {
		await this.plugin.saveData(this.data);
	}

	async load() {
		// Load settings from Disk
		const data = await this.plugin.loadData();

		// Merge data with defaults and assign to this.data
		this.data = new SettingsData(data);
		this.data.on('change', Debouncer(() => this.save()));
	}

	getActiveRules() {
		return this.data.getActiveRules();
	}

	getLoopbackLength() {
		return this.data.getLoopbackLength();
	}

	ruleUsed(ruleId: number) {
		this.data.usedRule(ruleId);
	}
}
