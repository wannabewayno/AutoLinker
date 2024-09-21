import { EventEmitter } from 'stream';
import Debouncer from 'src/utils/Debouncer';

function byRuleSpecificity(a: ActiveRule, b: ActiveRule) {
	return b[0].source.length - a[0].source.length;
}

/*
	Matching Sean should replace "Sean" with "[[Sean Smith|Sean]]"
	This is most likely just two rules. 
	"Sean's" => "[[Sean Smith|Seans's]]"
*/
type UserRule = {
	matchingText: string[],
	replacementText: string,
	activated: boolean,
	lastUsed?: string,
	usage: number,
};
type UserRules = UserRule[];

// i.e the regex to match (the rule), the string to replace the matching text with (the replacement), id (currently the index) of the original rule
type ActiveRule = [RegExp, string, number]
type ActiveRules = ActiveRule[]

/**
 * Extends EventEmitter so you can hook into the data changing if you want to.
 * Current events
 * 'change' is emitted whenever any data changes
 */
export default class SettingsData extends EventEmitter {
	public loopbackLength: number;
	public readonly rules: UserRules;
	public activeRules: ActiveRules;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(data: any) {
		super();
		const DEFAULT_SETTINGS = {
			loopbackLength: 0,
			rules: [],
			activeRules: [],
		}

		const { rules = [] } = data || {};
		// Assign defaults and load data onto this instance.
		Object.assign(this, DEFAULT_SETTINGS, { rules });

		// Process the rules on load.
		this.processUserRules();

		// Whenever any data changes re-process user rules
		this.on('change', Debouncer(() => this.processUserRules()));
	}

	/**
	 * Adds a new rule with placeholders
	 */
	addRule() {
		this.rules.push({ matchingText: [], replacementText: '', activated: true, usage: 0 });
		this.emit('change');
	}

	/**
	 * Get's a rule by index
	 * @param index 
	 */
	getRule(index: number): UserRule | null {
		return this.rules[index] ?? null;
	}

	/**
	 * Is a current rule active?
	 * @param index 
	 */
	isActive(index: number) {
		const rule = this.getRule(index);
		if (!rule) return false;
		return rule.activated;
	}

	/**
	 * Updates a rule's matching text/s and refreshes active rules.
	 * @param index 
	 */
	updateRuleMatchingText(index: number, newText: string) {
		const rule = this.getRule(index);
		if (!rule) return null;

		rule.matchingText = newText.split(',').filter(Boolean);

		this.emit('change');
	}

	/**
	 * Updates a rule's replacement text by index and refreshes active rules.
	 * @param index 
	 */
	updateRuleReplacementText(index: number, newText: string) {
		// We need to split by commas as it may match.
		const rule = this.getRule(index);
		if (!rule) return null;

		rule.replacementText = newText;
		this.emit('change');
	}

	processUserRules() {
		let loopbackLength  = 0
		this.activeRules = this.rules.reduce((phrases: ActiveRules, { matchingText, replacementText, activated }, index) => {
			if (!activated || !matchingText.length) return phrases;

      let maximumPhraseLength = 0
			const multiPhrases = matchingText.map(text => {
        text = text.trim();
        maximumPhraseLength = Math.max(maximumPhraseLength, text.length + 3); // '3' accounts for "'s " that may be at the end
        return [new RegExp(`\\b${text}('s)?\\b`), replacementText, index] as ActiveRule;
      });

			loopbackLength = Math.max(loopbackLength, maximumPhraseLength);
			phrases.push(...multiPhrases)
			return phrases
		}, []).sort(byRuleSpecificity);
		this.loopbackLength = loopbackLength;
	}

	/**
	 * Toggles a rule's activated status by index and updates active rules.
	 * @param index 
	 */
	toggleRuleActive(index: number): void {
		const rule = this.getRule(index);
		if (!rule) return;
		rule.activated = !rule.activated;

		this.emit('change');
	}

	setRuleActivated(index: number, state: boolean) {
		const rule = this.getRule(index);
		if (!rule) return;
		rule.activated = state;

		this.emit('change');
	}

	/**
	 * Removes a rule by index and updates active rules
	 * @param index 
	 */
	removeRule(index: number) {
		this.rules.splice(index, 1);

		this.emit('change');
	}

	getActiveRules() {
		return this.activeRules;
	}

	usedRule(ruleIndex: number) {
		const rule = this.getRule(ruleIndex);
		if (!rule) return;
		rule.usage++;
		rule.lastUsed = new Date().toISOString();
	}
	
	getLoopbackLength() {
		return this.loopbackLength;
	}
}