import keyMirror from 'keyMirror';

export default {
  DEFAULT_LANGUAGE: 'es',
  LANGUAGE_API_PATH: 'assets/translations/',

  // Each time you add an action, add it here... They should be past-tense
  ActionTypes: keyMirror({
    LANGUAGE_CHANGED: null,
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null,
  }),
};
