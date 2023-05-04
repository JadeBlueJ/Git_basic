

async function login(e)
{   try
    {
        e.preventDefault();

        const email = e.target.email.value
        const password = e.target.password.value
        const ob = {
            email:email,
            password:password
        }

        const response = await axios.post('http://localhost:3000/login',ob)
        if(response.status===201){
            
            localStorage.setItem('token',response.data.token)
            localStorage.setItem('user',response.data.username)
            alert('Login successful')

            const resp = await axios.post('http://localhost:3000/newConnection',{username:response.data.username})
            window.location.href = '../index.html';


        }
        else {  
                
                throw new Error('Failed to login')
        }
        
    }

    catch(err){
        alert('Invalid Email/Password')
        document.body.innerHTML+=`<div style = "color:red">${err}</div> `
    }

    
}