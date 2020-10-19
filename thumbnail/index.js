const Thumbler = require('thumbler');
 
const pa = './public/2db112ed75b79358dcc229f83908d00e.mp4'
const da = '12345'
Thumbler({
    type: 'video', 
    input: pa,
    output: `./thum/${da}.jpeg`, 
    time: '00:00:5',
    size: '400x300' // this optional if null will use the desimention of the video
}, function(err, path){
    if (err) return err;
    return path;
});