import { Editor } from 'obsidian';
import type { GetActiveCharacterScope } from './GetActiveCharacterScope';
import type { MatchPhraseRulesAgainstScope } from './MatchPhraseRulesAgainstScope';
import type { EditDocument } from './EditDocument';

type Dependencies = {
  getActiveCharacterScope: GetActiveCharacterScope,
  matchPhraseRulesAgainstScope: MatchPhraseRulesAgainstScope,
  editDocument: EditDocument,
}

export type ReplaceTextWithLink = (editor: Editor) => void

export default ({
  getActiveCharacterScope,
  matchPhraseRulesAgainstScope,
  editDocument,
}: Dependencies): ReplaceTextWithLink => {
  return (editor: Editor) => {
    const scope = getActiveCharacterScope(editor);
    if (!scope) return;

    const matchedPhrase = matchPhraseRulesAgainstScope(scope);
    if (!matchedPhrase) return;
  
    editDocument(editor, matchedPhrase);
  }
}