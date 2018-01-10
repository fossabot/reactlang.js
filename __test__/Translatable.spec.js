
import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import langObject from './testLangObject';

import Translatable from '../src/Translatable';

configure({ adapter: new Adapter() });

describe('>>> Translatable', () => {
    const props = {
        content: {
            transKey: 'common.home'
        },
        lang: langObject
    };

    it('should render the component', () => {
        const output = shallow(
            <Translatable
                {...props}
            />
        );
        expect(output.length).toEqual(1);
    });

    it('should render a span when the component has no children', () => {
        const output = mount(
            <Translatable
                {...props}
            />
        );
        expect(output.find('span').length).toEqual(1);
    });

    it('should render the child element', () => {
        const output = mount(
            <Translatable
                {...props}
            >
                <h1 />
            </Translatable>
        );
        expect(output.find('h1').length).toEqual(1);
    });

    it('should render the child element with the correct text', () => {
        const output = shallow(
            <Translatable
                {...props}
            >
                <h1 />
            </Translatable>
        );
        expect(output.text()).toEqual('Home');
    });

    it('should render the child element with the translated attribute', () => {
        const output = shallow(
            <Translatable
                attributes={{
                    placeholder: {
                        transKey: 'common.first_name'
                    }
                }}
                lang={langObject}
            >
                <input type="text" />
            </Translatable>
        );
        expect(output.prop('placeholder')).toEqual('First name');
    });

    it('should render a span with the translated attribute and content', () => {
        const output = shallow(
            <Translatable
                attributes={{
                    'data-type': {
                        transKey: 'common.help'
                    }
                }}
                content={{
                    transKey: 'common.help'
                }}
                lang={langObject}
            />
        );
        expect(output.prop('data-type')).toEqual('Help');
        expect(output.text()).toEqual('Help');
    });

    it('should render the child element with the translated attribute and content', () => {
        const output = shallow(
            <Translatable
                attributes={{
                    'data-type': {
                        transKey: 'common.help'
                    }
                }}
                content={{
                    transKey: 'common.help'
                }}
                lang={langObject}
            >
                <p />
            </Translatable>
        );
        expect(output.prop('data-type')).toEqual('Help');
        expect(output.text()).toEqual('Help');
    });

});
