import produce from './produce';

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


// console.log(immutable);