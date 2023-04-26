

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
            localStorage.setItem('token',response.data.token)
            // alert('Token set')
            localStorage.setItem('userDetails',JSON.stringify(response.data.user))
            // alert('user set')
            // const userDetails = (localStorage.getItem('userDetails'));
            // console.log(userDetails)
            // window.location.href='./Expense_Tracker.html'
        }
        else {
                throw new Error('Failed to login')
        }
        
    }

    catch(err){
        document.body.innerHTML+=`<div style = "color:red">${err}</div> `
    }

    
}