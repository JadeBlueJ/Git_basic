console.log('1')
console.log('2')


const movie = async() =>{
    
    const wiftick = new Promise((res,rej)=>{
        setTimeout(()=>
        {
            res('Tickets from wife')
        }, 3000)
    })
    const popcorn = new Promise((res,rej)=>{res('popcorn')});
    
    let tic = await wiftick;
    console.log(`Got ${tic}`)
    console.log('need popcorn');
    
    let pop = await popcorn;
    console.log(`Got ${pop}`)
    console.log('need butter on popcorn');
     const butter = new Promise((res,rej)=>{res('butter')});
     
     let but = await butter;
     console.log(`Got ${but}`)
     
     const icecream = new Promise((res)=>res('Ice Cream'))
      let ice = await icecream;
      console.log(`Got ${ice}`)
      
     return 'Ready to go in'
}
    
    
    
    
    
  
movie().then((e)=>console.log(e))
console.log('4')
console.log('5')
