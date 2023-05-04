

async function login(e)
{   try
    {
        e.preventDefault();

        const mail = e.target.email.value
        const password = e.target.password.value
        const ob = {
            mail:mail,
            password:password
        }

        const response = await axios.post('http://localhost:3000/user/login',ob)
        if(response.status===201){
            alert('Login successful')
            localStorage.setItem('true',true)
            window.location.href = `../index.html`;
            // axios.get(`http://localhost:3000/chat/${response.data.username}`)
        }
        else {
                throw new Error('Failed to login')
        }
        
    }

    catch(err){
        document.body.innerHTML+=`<div style = "color:red">${err}</div> `
    }

    
}