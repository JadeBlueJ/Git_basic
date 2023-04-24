const a = document.getElementById('a') as HTMLInputElement
const b = document.getElementById('b') as HTMLInputElement
const buttonEle  = document.querySelector('button')!
const numArr:number[]=[]
const strArr:string[]=[]
type numOrString = number|string
type res ={val:number,timestamp:Date}
function sum(a:numOrString,b:numOrString ){
    if(typeof a==='number' && typeof b==='number')
    return a+b
    if(typeof a==='string' && typeof a==='string')
    return a+' ' + b
    else return +a+ +b
}

function printVal(resOb:res){
    console.log(resOb.val)
}

buttonEle.addEventListener('click',()=>{
    const n1=a.value
    const n2=b.value
    
    const res = sum(+n1,+n2)
    numArr.push(res as number)
    const res2 = sum(n1,n2)
    strArr.push(res2 as string)
    console.log(strArr,numArr)
    printVal({val:res as number,timestamp:new Date()})
})

const Promise1 = new Promise<string>((res,rej)=>{
    setTimeout(() => {
        res('Worked')
    }, 1000);
})

Promise1.then((res)=>{
    console.log(res.split('w'))
})