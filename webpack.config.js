var webpack = require('webpack');
var config ={
    entry: {
        app:['./src/app.js']
    },
    output:{
        path:'./client/',
        filename:'bundle.js'
    },
    devServer:{
        inline:true,
        port:3000
    }
    ,
    plugins:[]
    ,
    module:{
        loaders:[
             {
                test: /\.html$/,
                loader:'raw',
                exclude:/node_modules/
            }
             ,
             {
                test: /\.css$/,
                loader:'style!css',
                exclude:/node_modules/
            }
        ]
    }
}

module.exports = config;
