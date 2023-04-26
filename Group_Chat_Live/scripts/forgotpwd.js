
async function forgot(e){
    e.preventDefault();

    try{
    console.log('Inside forgot')
    localStorage.setItem('resetmail',e.target.mail.value)
    const respone = await axios.post(`http://localhost:3000/password/forgotpassword/${e.target.mail.value}`)
    
    }
    catch(err){
        console.log(err)
    }

}

