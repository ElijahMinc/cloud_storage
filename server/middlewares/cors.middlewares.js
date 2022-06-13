module.exports = (req,  res, next) => {
   // if(req.method === 'OPTIONS'){
   //    next()
   // }

   res.set({
      'Access-Control-Allow-Origin': ['*'],
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Access-Control-Allow-Headers': ['Content-Type', 'Authorization']
    })

    next();
}