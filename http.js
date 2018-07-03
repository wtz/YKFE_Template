var express = require('express');
var path = require('path');
var proxy = require('http-proxy-middleware');

// proxy middleware options
var options = {
  target: 'http://nu2018dzb.sanguosha.com', // target host
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  // pathRewrite: {
  //     '^/api/old-path' : '/api/new-path',     // rewrite path
  //     '^/api/remove/path' : '/path'           // remove base path
  // },
  // router: {
  //     // when request.headers.host == 'dev.localhost:3000',
  //     // override target 'http://www.example.org' to 'http://localhost:8000'
  //     'localhost:3000' : 'http://localhost:8000'
  // }
};

// create the proxy (without context)
var exampleProxy = proxy(options);



var app = express();
app.use(express.static(path.join(__dirname, './'+process.env.type)));

app.use('/front', exampleProxy);
app.listen(3000);
