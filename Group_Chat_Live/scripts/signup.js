async function signup(e)
{   try
    {
        e.preventDefault();


        let ob={
            name : e.target.fname.value,
            mail : e.target.email.value,
            phone : e.target.phone.value,
            password : e.target.password.value
        }

        console.log(ob)

        const response = await axios.post('http://localhost:3000/user/signup',ob)
        if(response.status===201){
            // window.location.href='./login.html'
            alert('Sign up successful')
        }
        else {
                
                throw new Error('Failed to login')
        }
    }
    catch(err) {
        alert('User exists, please login')
        document.body.innerHTML+=`<div style = "color:red">${err}</div> `
    }

    
}