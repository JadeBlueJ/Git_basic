

async function login(e)
{   try
    {
        e.preventDefault();

        const mail = e.target.mail.value
        const password = e.target.password.value
        const ob = {
            mail:mail,
            password:password
        }

        const response = await axios.post('http://localhost:3000/user/login',ob)
        if(response.status===201){
            alert('Login successful')
            window.location.href='./Expense_Tracker.html'
            
        }
        else {
                throw new Error('Failed to login')
        }
        
    }

    catch(err){
        document.body.innerHTML+=`<div style = "color:red">${err}</div> `
    }

    
}