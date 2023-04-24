"use strict";
const a = document.getElementById('a');
const b = document.getElementById('b');
const buttonEle = document.querySelector('button');
const numArr = [];
const strArr = [];
function sum(a, b) {
    if (typeof a === 'number' && typeof b === 'number')
        return a + b;
    if (typeof a === 'string' && typeof a === 'string')
        return a + ' ' + b;
    else
        return +a + +b;
}
function printVal(resOb) {
    console.log(resOb.val);
}
buttonEle.addEventListener('click', () => {
    const n1 = a.value;
    const n2 = b.value;
    const res = sum(+n1, +n2);
    numArr.push(res);
    const res2 = sum(n1, n2);
    strArr.push(res2);
    console.log(strArr, numArr);
    printVal({ val: res, timestamp: new Date() });
});
const Promise1 = new Promise((res, rej) => {
    setTimeout(() => {
        res('Worked');
    }, 1000);
});
Promise1.then((res) => {
    console.log(res.split('w'));
});
