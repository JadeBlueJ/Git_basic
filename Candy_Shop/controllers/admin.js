const Candy = require('../models/Candy');

exports.postCandy = async (req,res,next)=>{
  try{
  const cname = req.body.cname
  const description = req.body.description
  const cprice = req.body.cprice
  const qty = req.body.qty
  const data = await Candy.create({cname:cname, description:description,cprice:cprice,qty:qty})
  res.status(201).json({newCandyDetail:data})
  console.log('Added')
  }
  catch(e) 
  {
      res.status(500).json({
          error:e
      })
  }
}

exports.getCandies = async(req,res,next)=>{

  const candies = await Candy.findAll()
  res.json({allCandy:candies})
}

exports.getCandy = async(req,res,next)=>{
  const cid = req.params.id 
  const candy = await Candy.findByPk(cid)
  res.json(candy)
}

exports.updateCandy1 = async(req,res,next)=>{
  const updateId = req.params.id
  // console.log(deluser)
  Candy.findByPk(updateId).then(candy=>{
    Candy.update(
      {
        qty:candy.qty-1
      },
      {
        where:{id:updateId}
      }
    )
    .then(result=>{
      return console.log('Updated')
    })
  })
  .catch(e=>console.log(e))
}

exports.updateCandy2 = async(req,res,next)=>{
  const updateId = req.params.id
  // console.log(deluser)
  Candy.findByPk(updateId).then(candy=>{
    Candy.update(
      {
        qty:candy.qty-2
      },
      {
        where:{id:updateId}
      }
    )
    .then(result=>{
      return console.log('Updated')
    })
  })
  .catch(e=>console.log(e))
}

exports.updateCandy3 = async(req,res,next)=>{
  const updateId = req.params.id
  // console.log(deluser)
  Candy.findByPk(updateId).then(candy=>{
    Candy.update(
      {
        qty:candy.qty-3
      },
      {
        where:{id:updateId}
      }
    )
    .then(result=>{
      return console.log('Updated')
    })
  })
  .catch(e=>console.log(e))
}

exports.deleteCandy = async(req,res,next)=>{
  const delCandy = req.params.id
  // console.log(deluser)
  Candy.findByPk(delCandy)
  .then(candy=>{
    candy.destroy()
  })
  .then(result=>{
    console.log('Deleted')
  })
  .catch(e=>console.log(e))
}