const token = localStorage.getItem('token')


async function forgot(e){
    e.preventDefault();
    axios.post(`http://localhost:3000/password/forgotpassword/${e.target.mail.value}`,{headers:{"authorization":token}})

}