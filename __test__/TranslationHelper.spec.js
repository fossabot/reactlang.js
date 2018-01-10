
import TranslationHelper from '../src/TranslationHelper';

import langObject from './testLangObject';

describe('>>> TranslationHelper', () => {
    const translationHelper = new TranslationHelper({
        messages: langObject
    });

    it('should return string when provided with a valid transKey', () => {
        expect(translationHelper.get('common.home'))
            .toEqual('Home');
    });

    it('should return transKey if transKey is not a valid translation key', () => {
        expect(translationHelper.get('Bobbins'))
            .toEqual('Bobbins');
    });

    it('should return the translation with replacements', () => {
        const replacements = {
            number: 5
        };
        expect(translationHelper.choice('common.people_count', 5, replacements)).toEqual('5 people');
    });

});
