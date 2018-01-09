
import React, { Component } from 'react';
import { func, node, number, object, objectOf, oneOfType, shape, string } from 'prop-types';

import TranslationHelper from './TranslationHelper';

export default class Translatable extends Component {
    static propTypes = {
        attributes: object,
        children: node,
        className: string,
        content: shape({
            transKey: string.isRequired,
            count: number,
            replacements: objectOf(oneOfType([string, number]))
        }),
        handleError: func.isRequired,
        id: oneOfType([number, string]),
        lang: objectOf(object).isRequired
    }

    langHelper = new TranslationHelper({
        messages: this.props.lang
    })

    applyPropsAndContentToChildren = (props, content = null) => {
        return React.Children.map(this.props.children, child => {
            const propsToApply = {
                ...child.props,
                ...props
            };
            for (const key in child.props) {
                if (props[key]) {
                    if (props[key] instanceof Object) {
                        propsToApply[key] = {
                            ...child.props[key],
                            ...props[key]
                        };
                    } else if (typeof props[key] === 'string') {
                        propsToApply[key] = `${child.props[key]} ${props[key]}`;
                    }
                }
            }
            if (props.nestedAttributes) {
                for (const key in child.props) {
                    if (props.nestedAttributes[key]) {
                        const prop = child.props[key];
                        if (prop && prop instanceof Object && propsToApply[key]) {
                            propsToApply[key] = {
                                ...prop,
                                ...props[key]
                            };
                        }
                    }
                }
            }
            let updatedChild = React.cloneElement(child, propsToApply, content);
            if (child.props.children) {
                updatedChild = React.cloneElement(child, propsToApply, child.props.children);
            }
            return updatedChild;
        });
    }

    handleAttributes = props => {
        const newProps = { ...props };
        for (const key in newProps.attributes) {
            const attribute = newProps.attributes[key];
            if (attribute) {
                const transString = this.mungeString(attribute);
                newProps[key] = transString;
            }
        }
        return newProps;
    }

    handleNestedAttributes = props => {
        const newProps = { ...props };
        for (const key in newProps.nestedAttributes) {
            const nestedAttribute = newProps.nestedAttributes[key];
            if (nestedAttribute) {
                for (const k in nestedAttribute) {
                    const attribute = nestedAttribute[k];
                    if (attribute) {
                        const transString = this.mungeString(attribute);
                        newProps[key] = {};
                        newProps[key][k] = transString;
                    }
                }
            }
        }
        return newProps;
    }

    mungeString = ({ transKey, count, replacements }) => {
        if (typeof count !== 'undefined' && typeof replacements !== 'undefined') {
            return this.langHelper.choice(transKey, count, replacements);
        } else if (typeof count === 'undefined' && typeof replacements !== 'undefined') {
            if (this.props.handleError) {
                this.props.handleError({
                    message: 'Replacements were given without the required count property',
                    name: 'No count supplied'
                });
            } else {
                throw new Error('Replacements were given without the required count property');
            }
        }
        return this.langHelper.get(transKey);
    }

    removeUnwantedStoreProps = () => {
        const props = { ...this.props };
        delete props.store;
        delete props.storeSubscription;
        delete props.dispatch;
        delete props.lang;
        return props;
    }

    render() {
        if (this.props.children && React.Children.count(this.props.children) > 1) {
            if (this.props.handleError) {
                this.props.handleError({
                    message: 'The Translatable component only allows a single child',
                    name: 'Too many children'
                });
            } else {
                throw new Error('The Translatable component only allows a single child');
            }
        }
        let props = this.removeUnwantedStoreProps();
        const content = props.content;
        delete props.content;
        delete props.handleError;
        if (props.className) {
            props.className = `translatable ${props.className}`;
        } else {
            props.className = 'translatable';
        }
        if (props.attributes) {
            props = this.handleAttributes(props);
            delete props.attributes;
        }
        if (props.nestedAttributes) {
            props = this.handleNestedAttributes(props);
        }
        if (this.props.children) {
            delete props.children;
            let children;
            if (content) {
                const translatedString = this.mungeString(content);
                children = this.applyPropsAndContentToChildren(props, translatedString);
            } else {
                children = this.applyPropsAndContentToChildren(props);
            }
            const component = children[0];
            return React.createElement(component.type, component.props);
        }
        return (
            <span {...props}>{this.mungeString(content)}</span>
        );
    }
}
