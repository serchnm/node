// var express = require('express'),
//     aws = require('aws-sdk'),
//     bodyParser = require('body-parser'),
//     multer = require('multer'),
//     multerS3 = require('multer-s3'),
//     fs = require('fs');

// aws.config.update({
//     secretAccessKey: 'rmarncP64bnof+67P51pQ6f44TGx2EdHWwt3oHcV',
//     accessKeyId: 'AKIAR6E4AHOITXJP77KA',
//     region: 'us-east-1'
// });

// var app = express(),
//     s3 = new aws.S3();

// app.use(bodyParser.json());

// var upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'nomnomdevtest',
//         key: function (req, file, cb) {
//             console.log(file);
//             cb(null, file.originalname); //use Date.now() for unique file keys
//         }
//     })
// });

// const getObject = key => {
//     return new Promise((resolve, reject) => {
//         s3.getObject({
//             Bucket: 'nomnomdevtest', // Assuming this is an environment variable...
//             Key: key
//         }, (err, data) => {
//             if ( err ) reject(err)
//             else resolve(data)
//         })
//     })
// }
// async () => {
//     try {
//         // You'd probably replace 'someImage' with a variable/parameter
//         const response = await getObject('video.mp4');

//     } catch (err) {
//         console.error(err)
//     }
// } 
// //open in browser to see upload form
// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/index.html');//index.html is inside node-cheat
// }); 


// const uploadS3 = upload.array('upl',1)
// app.post('/upload', uploadS3, function (req, res, next) {
//     res.send("Uploaded!");
// });
// app.get('/download', response);

// app.listen(3000, function () {
//     console.log('Example app listening on port 3000!');
// });
const express = require('express');
const multer  = require('multer');
const AWS = require('aws-sdk');
const fs=require('fs');

const app = express();

// configuring the DiscStorage engine.
const storage = multer.diskStorage({
    destination : 'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

//setting the credentials
//The region should be the region of the bucket that you created
//Visit this if you have any confusion - https://docs.aws.amazon.com/general/latest/gr/rande.html
AWS.config.update({
    secretAccessKey: 'rmarncP64bnof+67P51pQ6f44TGx2EdHWwt3oHcV',
    accessKeyId: 'AKIAR6E4AHOITXJP77KA',
    region: 'us-east-1'
});

//Creating a new instance of S3:
const s3= new AWS.S3();

//POST method route for uploading file
app.post('/post_file', upload.single('demo_file'), function (req, res) {
  //Multer middleware adds file(in case of single file ) or files(multiple files) object to the request object.
  //req.file is the demo_file
  uploadFile(req.file.path, req.file.filename ,res);
})

//GET method route for downloading/retrieving file
app.get('/get_file/:file_name',(req,res)=>{
  retrieveFile(req.params.file_name, res);
});

//listening to server 3000
app.listen(3005,()=>{
    console.log('Server running on port 3005 now');
});

//The uploadFile function
function uploadFile(source,targetName,res){
    console.log('preparing to upload...');
    fs.readFile(source, function (err, filedata) {
      if (!err) {
        const putParams = {
            Bucket      : 'nomnomdevtest',
            Key         : targetName,
            Body        : filedata
        };
        s3.putObject(putParams, function(err, data){
          if (err) {
            console.log('Could nor upload the file. Error :',err);
            return res.send({success:false});
          } 
          else{
            fs.unlink(source);// Deleting the file from uploads folder(Optional).Do Whatever you prefer.
            console.log('Successfully uploaded the file');
            return res.send({success:true});
          }
        });
      }
      else{
        console.log({'err':err});
      }
    });
  }

//The retrieveFile function
function retrieveFile(filename,res){

  const getParams = {
    Bucket: 'nomnomdevtest',
    Key: filename
  };

  s3.getObject(getParams, function(err, data) {
    if (err){
      return res.status(400).send({success:false,err:err});
    }
    else{
      return res.send(data.Body);
    }
  });
}