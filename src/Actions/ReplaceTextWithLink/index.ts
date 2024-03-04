import AutoLinker from "src/index";
import EditDocument from "./EditDocument";
import GetActiveCharacterScope from "./GetActiveCharacterScope";
import MatchPhraseRulesAgainstScope from "./MatchPhraseRulesAgainstScope";
import ReplaceTextWithLink from "./ReplaceTextWithLink"
import HasCursorMovedForward from "./HasCursorMovedForward";
import IsCursorInsideLink from "./IsCursorInsideLink";
import GetPhraseFromParts from "./GetPhraseFromParts";
import GetReplacement from "./GetReplacement";
import GetReplacementRange from "./GetReplacementRange";
import GetRangeStart from "./GetRangeStart";
import GetRangeEnd from "./GetRangeEnd";

export default (plugin: AutoLinker) => {
  const settings = plugin.settings;
  const hasCursorMovedForward = HasCursorMovedForward();
  const isCursorInsideLink = IsCursorInsideLink();
  const getPhraseFromParts = GetPhraseFromParts({ settings });
  const getReplacement = GetReplacement();

  const getRangeStart = GetRangeStart({ settings });
  const getRangeEnd = GetRangeEnd();

  const getReplacementRange = GetReplacementRange({ getRangeEnd, getRangeStart });

  const getActiveCharacterScope = GetActiveCharacterScope({
    hasCursorMovedForward,
    isCursorInsideLink,
    getPhraseFromParts,
    settings: plugin.settings,
  });
  const matchPhraseRulesAgainstScope = MatchPhraseRulesAgainstScope({ settings: plugin.settings });
  const editDocument = EditDocument({ getReplacement, getReplacementRange });

  // Return the initialized action.
  return ReplaceTextWithLink({ getActiveCharacterScope, matchPhraseRulesAgainstScope, editDocument });
}