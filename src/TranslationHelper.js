
import Lang from 'lang.js';

export default class TranslationHelper extends Lang {
    constructor(options) {
        super(options);
        this.messages = options.messages;
    }

    // Overwrite _parseKey of lang.js import to remove the need
    // to include locale prefix in translation keys
    _parseKey(key) {
        if (typeof key !== 'string') {
            return null;
        }

        const segments = key.split('.');
        const source = segments[0].replace(/\//g, '.');

        return {
            source,
            sourceFallback: source,
            entries: segments.slice(1)
        };
    }
}
