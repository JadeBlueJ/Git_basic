async function signup(e)
{   try
    {
        e.preventDefault();


        let ob={
            name : e.target.name.value,
            mail : e.target.mail.value,
            password : e.target.password.value
        }

        console.log(ob)

        const response = await axios.post('http://localhost:3000/user/signup',ob)
        if(response.status===201){
            window.location.href='./login.html'
        }
        else {
                throw new Error('Failed to login')
        }
    }
    catch(err) {
        document.body.innerHTML+=`<div style = "color:red">${err}</div> `
    }

    
}