import produce from './produce';

const assert = (x: boolean) => {
    if (!x) {
        throw(new Error(''));
    }
};

test('produce plain object', () => {
    const base = {
        a: 1,
        b: {
            c: 2,
            d: 3,
        }
    }
    const immutable = produce(base, (draft: any) => {
        draft.b.c = 6;
    })
    assert(base !== immutable);
    assert(base.b.c === 2);
    assert(immutable.b.c === 6);
})
