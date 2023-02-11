console.log('1')
console.log('2')
    
    const wiftick = new Promise((res,rej)=>{
        setTimeout(()=>
        {
            res('Tickets from wife')
        }, 3000)
    })


    const popcorn = wiftick.then((val) =>{
        console.log(`Got ${val}`)
        console.log(' Need Popcorn')
        
        return new Promise((res,rej)=>{res('Popcorn')});
})


const butter = popcorn.then((val)=>{
    console.log(`Got ${val}`)
        console.log('need butter on popcorn');
        return new Promise((res,rej)=>{res('butter')});
})

const ice = butter.then((val)=>{
    console.log(`Got ${val}`)
        console.log('need icecream');
        return new Promise((res,rej)=>{res('icecream')});
})

ice.then((val)=>{
    console.log(`Got ${val}`);
    console.log(`Ready to go in`)
})

    

console.log('4')
console.log('5')
