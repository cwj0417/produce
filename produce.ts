const keyForState = Symbol('key-for-state');
type state = {
    base: any,
    copy: any,
    modified: boolean,
    parent?: state,
}

let scope = {
    drafts: []
}

const markChanged = (state: state) => {
    state.modified = true;
    if (state.parent) {
        markChanged(state.parent);
    }
}

const createProxy = (value: any, parent: state) => {
    const state: state = {
        base: value,
        copy: null,
        modified: false,
        parent,
    }
    const handler = {
        set (state: state, prop: string, v: any) {
            console.log('set', prop, v);
            if (!state.modified) {
                state.copy = state.copy || {...state.base};
                markChanged(state);
            }
            state.copy[prop] = v;
            return true;
        },
        get (state: state, prop: string | symbol) {
            console.log('get', prop);
            if (prop === keyForState) return state;
            const source = state.copy || state.base;
            const value = source[prop];
            if (value === state.base[prop]) {
                state.copy = state.copy || {...state.base};
                return (state.copy[prop] = createProxy(value, state));
            }
            return value;
        }
    }
    const { proxy, revoke } = Proxy.revocable(state, handler);
    
    scope.drafts.push(proxy);

    return proxy;
}

const produce: <T = any>(baseState: T, recipe: (d: object) => any) => T = (baseState, recipe) => {
    
    const proxy = createProxy(baseState, undefined);
    recipe(proxy);
    console.log(proxy);
    console.log(scope);
    return baseState;
}

export default produce;
