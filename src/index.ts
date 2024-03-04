import { App, PluginManifest, Plugin } from 'obsidian';
import Settings from 'src/Settings/Settings';
import ReplaceTextWithLink from 'src/Actions/ReplaceTextWithLink';

export default class AutoLinker extends Plugin {
	settings: Settings;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);

		// Create settings.
		this.settings = new Settings(this.app, this);
	}

	// Initialization
	async onload() {
		// This adds a settings tab so the user can configure various aspects of the plugin
		await this.settings.register();

		// We need to register events
		this.registerEvent(
			this.app.workspace.on('editor-change', ReplaceTextWithLink(this))
		);
	}

	// Cleanup
	onunload() {

	}
}
