//Axios Globals
axios.defaults.headers.common['X-auth-token'] = 'some token'

// GET REQUEST
function getTodos() {
    // axios({
    //     method:'get',
    //     url:'https://jsonplaceholder.typicode.com/todos'
    // }).then(val=>showOutput(val))
    // .catch(e=>console.log(e))

    // .then(val=>{
    //     val.data.forEach(item =>console.log(item))
    //     })
    //     .catch(e=>console.log(e))

axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5',{timeout:5})
.then(val=>showOutput(val))
.catch(e=>console.log(e))
  }
  
  // POST REQUEST
  function addTodo() {
    //     axios({
    //     method:'post',
    //     url:'https://jsonplaceholder.typicode.com/todos',
    //     data:{
    //         title:'New Todo',
    //         completed: false
    //     }
    // }).then(val=>showOutput(val))
    // .catch(e=>console.log(e))

    axios.post('https://jsonplaceholder.typicode.com/todos',{
                title:'New Todo',
                completed: false
            })
            .then(val=>showOutput(val))
            .catch(e=>console.log(e))



  }
  
  // PUT/PATCH REQUEST
  function updateTodo() {
    axios.patch('https://jsonplaceholder.typicode.com/todos/1',{
                title:'Updated Todo',
                completed: true
            })
            .then(val=>showOutput(val))
            .catch(e=>console.log(e))
  }
  
  // DELETE REQUEST
  function removeTodo() {
    axios.delete('https://jsonplaceholder.typicode.com/todos/1')
            .then(val=>showOutput(val))
            .catch(e=>console.log(e))
  }
  
  // SIMULTANEOUS DATA
  function getData() {
    axios.all([
        axios.get('https://jsonplaceholder.typicode.com/todos'),
        axios.get('https://jsonplaceholder.typicode.com/posts'),
    ]).then(axios.spread((todos, posts)=>showOutput(posts)))

}
  
  
  // CUSTOM HEADERS
  function customHeaders() {
    const config={
        headers:{
            'Content-Type':'app/json',
            Authorization:'token'
        }
    }

    axios.post('https://jsonplaceholder.typicode.com/todos',{
        title:'New Todo',
        completed: false
    },config)
    .then(val=>showOutput(val))
    .catch(e=>console.log(e))
  }
  
  // TRANSFORMING REQUESTS & RESPONSES
  function transformResponse() {
    const options = {
        method: 'post',
        url:'https://jsonplaceholder.typicode.com/todos',
        data:{
            title:'Hello world'
        },
        transformResponse:axios.defaults.transformResponse.concat(val=>{
            val.title=val.title.toUpperCase();
            return val;
        })

    }
    axios(options).then(res=>showOutput(res))
  }
  
  // ERROR HANDLING
  function errorHandling() {
    
    axios.get('https://jsonplaceholder.typicode.com/todoss',{
        validateStatus:function(status){
            return status<500 // reject if status greater or equal to 500
        }
    })
.then(val=>showOutput(val))
.catch(e=>{
    if(e.response){
        console.log(e.response.data)
        console.log(e.response.headers)
        console.log(e.response.status)
    }
    else if(e.request)
    {
        console.log(e.request)
    }
    else console.log(e.message)
}) 
  }
  
  // CANCEL TOKEN
  function cancelToken() {
    const source=axios.CancelToken.source();
    axios.get('https://jsonplaceholder.typicode.com/todos',{cancelToken:source.token})
.then(val=>showOutput(val))
.catch(throws=>{
    if(axios.isCancel(throws)){
        console.log('Request canceled', throws.message)
    }
})
if(true)
{
    source.cancel('Request canceled')
}
  }
  
  // INTERCEPTING REQUESTS & RESPONSES

  axios.interceptors.request.use(config=>{
    console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`)

    return config
  }, err=>{
    return Promise.reject(err);
  })
  
  // AXIOS INSTANCES

  const instance=axios.create({
    baseURL:'https://jsonplaceholder.typicode.com'
  })
//   instance.get('/comments').then(res=>showOutput(res));

  
  // Show output in browser
  function showOutput(res) {
    document.getElementById('res').innerHTML = `
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
  }
  
  // Event listeners
  document.getElementById('get').addEventListener('click', getTodos);
  document.getElementById('post').addEventListener('click', addTodo);
  document.getElementById('update').addEventListener('click', updateTodo);
  document.getElementById('delete').addEventListener('click', removeTodo);
  document.getElementById('sim').addEventListener('click', getData);
  document.getElementById('headers').addEventListener('click', customHeaders);
  document
    .getElementById('transform')
    .addEventListener('click', transformResponse);
  document.getElementById('error').addEventListener('click', errorHandling);
  document.getElementById('cancel').addEventListener('click', cancelToken); 