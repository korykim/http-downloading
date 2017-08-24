var ProgressBar = require('./progress');
var https = require('https');
var http=require('http');
var fs=require('fs');
var path = require('path');
var urllib = require('url');

function isHTTPSUrl(url) {
    return urllib.parse(url).protocol === 'https:'
}

function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        fs.mkdir(path,function(){});
    }
    console.log();
}

const Getdownloadings=(url,paths,filename)=>new Promise((resolve,reject)=>{
  var dest = path.join(paths, filename);
  fsExistsSync(paths);
  var file=fs.createWriteStream(dest);
  if(isHTTPSUrl(url)){
    https.get(url, function(res){
      const { statusCode } = res;
      if (statusCode == 200) {
        var len = parseInt(res.headers['content-length'], 10);
        console.log();
        var bar = new ProgressBar('  downloading [:bar] :rate/kbs :percent :etas', {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: len
        });
        res.on('data', function (chunk) {
          bar.tick(chunk.length);
          file.write(chunk);
        });

        res.on('end', function () {
          //console.log('\n');
          resolve('Downloading Finish! => '+dest)
        });
      }else{
        reject('Unable to connect resource!');
      }
    })
  }else{
    http.get(url, function(res){
      const { statusCode } = res;
      if (statusCode == 200) {
        var len = parseInt(res.headers['content-length'], 10);
        console.log();
        var bar = new ProgressBar('  downloading [:bar] :rate/kbs :percent :etas', {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: len
        });

        res.on('data', function (chunk) {
          bar.tick(chunk.length);
          file.write(chunk);
        });

        res.on('end', function () {
          resolve('Downloading Finish! => '+dest)
        });
      }else{
        console.log('Unable to connect resource!');
         reject('Unable to connect resource!');
      }
    })
  }

})

exports.http_s_downloading=function(url,paths,filename){
  async function start(){
      try {
          var Finish_info = await Getdownloadings(url,paths,filename);
          return Finish_info;
      } catch (err) {
          console.log(err);
      }
  }
  start().then(code => console.log(code));
};

