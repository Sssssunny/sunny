const express = require('express');
const req = require('request');
const request = require('request-promise');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

app.get('/', function(req, res){

    let options = {
        method: 'GET',
        uri: 'https://datalab.naver.com/keyword/realtimeList.naver',
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
        },
        form: ''
        };

    request(options)
        .then(function(body){
        const code = cheerio.load(body);

        let viewTable = `
        <head>
        <title>실검</title>
        <link rel="stylesheet" href="http://cdn.jsdelivr.net/font-nanum/1.0/nanumbarungothic/nanumbarungothic.css">
        <link href="https://fonts.googleapis.com/css?family=Do+Hyeon" rel="stylesheet">
        <style>
        body {
          color:dimgray;
          font-family:'Nanum Barun Gothic';
          background-color:#dcdde2;
        }
        h1 {
          font-weight:normal;
          color:#000;
          font-size:37px;
          text-align:center;
          font-family:'Do Hyeon', sans-serif;
          padding-top:20px;
        }
        table {
          border:solid 1px #d4d4d4;
          background-color:white;
          width:300px;
        }
        table,td {
          text-align:center;
          font-size:17px;
        }
        td {
          height:40px;
        }
        td:hover {
          font-size:120%;
          color:#1CC700;
          cursor:pointer;
        }
        .age {
          color:3d3d3d;
          font-size:22px;
          text-align:center;
          padding:30px;
        }
        .age:hover {
          cursor:context-menu;
        }
        ::-moz-selection
        {
          background:#1CC700;
          color:white;
        }
        ::selection
        {
          background:#1CC700;
          color:white;
        }
        </style>
        </head>
  
        <h1>급상승검색어</h1>
        <table align="center">
        <tr>
          <th class="age">전체 연령대</th>
        </tr>
        `;
        const all = code("div[data-age='all']");

        const keywords = cheerio.load(all.html());
        const $ = keywords('span.title');

        for (let index = 0; index < $.length; index++) {
        const keyword = $.eq(index).text();

        viewTable += `
        <tr>
        <td>${keyword}</td>
        </tr>
        `;
        }

        viewTable += `</table>`;
        res.send(viewTable);;

        options = {
            method: 'post',
            uri: 'https://hooks.slack.com/services/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',
            body: {
                text: ' '
            },
            json: true
        };

        return request(options);
        })
        .then(function(resultData){
            console.log(resultData);
        })
});
app.listen(port, function(){
    console.log('express 서버 실행 중...');
})