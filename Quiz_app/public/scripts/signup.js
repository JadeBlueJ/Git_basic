async function signup(e)
{   try
    {
        e.preventDefault();


        let ob={
            fname : e.target.fname.value,
            email : e.target.email.value,
            phone : e.target.phone.value,
            password : e.target.password.value
        }

        console.log(ob)

        const response = await axios.post('http://localhost:3000/signup',ob)
        if(response.status===201){
            e.target.fname.value=''
            e.target.email.value=''
            e.target.phone.value=''
            e.target.password.value =''            
            alert('Sign up successful')
            window.location.href='./login.html'
        }
        else if(response.status==200) alert('Email Already Exists')
        
    }
    catch(err) {

        alert('Something went wrong')
        document.body.innerHTML+=`<div style = "color:red">${err}</div> `
    }

    
}