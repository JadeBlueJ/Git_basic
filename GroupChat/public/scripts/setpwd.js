async function reset(e){
    e.preventDefault();

    console.log('Inside reset')
    const user = JSON.parse('<%- user %>');
    const id = user.id
    try{
        const response = await axios.post(`http://localhost:3000/password/updatepassword/${id}`, {password: document.getElementById('pwd').value});
        console.log(response.data)
    }
    catch(err){
        console.log(err)
    }
}
