const AWS = require('aws-sdk')


const uploadToS3 = async(data,filename)=>{
    const BUCKET_NAME =`${process.env.BUCKET_NAME}`
    const IAM_USER_KEY=`${process.env.IAM_USER_KEY}`
    const IAM_USER_SECRET=`${process.env.IAM_USER_SECRET}`
    let s3Bucket = new AWS.S3({
      accessKeyId:IAM_USER_KEY,
      secretAccessKey:IAM_USER_SECRET,
    })
    
      var params = {
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
      }
      return new Promise((res,rej)=>{
        s3Bucket.upload(params,(err,response)=>{
          if(err)
          {
            console.log('Somehitng went wrong',err)
            rej(err)
          }
          else {
            console.log('Success',response)
            res(response.Location)
          }
        })
      })
      
  }

  module.exports={
    uploadToS3
  }