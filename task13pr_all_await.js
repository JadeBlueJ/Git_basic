async function f()
{
    const posts = [[{title: 'POST1'}],{activity:new Date().getTime()}];

function updateTime()
{
  return new Promise((res)=>{
    setTimeout(()=>{
      posts[1] = new Date().getTime();
      res([posts[1]]);
  },1000)
})
}

function createPost(post) {
  return new Promise( (resolve, reject) => {
    setTimeout( () => {
      posts[0].push(post);
      resolve(posts[0])
    }, 1000)
  }) 
}

function deletePost(){
  return new Promise((resolve, reject) => {
    setTimeout( () => {
      if(posts.length > 0){
        posts[0].pop()
        resolve(posts[0]);
      } else {
        reject("ERROR: ARRAY IS EMPTY")
      }
    }, 1000)
  })
}

let [a,b]= await Promise.all([createPost({title:'Post 2'}),updateTime()])
console.log(a,b[0]);
let[c,d] = await Promise.all([deletePost(),updateTime()])
console.log(c,d[0])
}
f()
// Promise.all([createPost(),updateTime()]).then((val)=>{
//   console.log(val)
// }).then(Promise.all([deletePost(),updateTime()]).then((val)=>{console.log(val)}))