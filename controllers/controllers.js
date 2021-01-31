const saySomething = (req, res, next) => {
       res.status(200).json({
           body: 'Hello from the Node Backend server! Testing Api (Open Console and see the body object from server)'
       });
   };
   
module.exports.saySomething = saySomething;

