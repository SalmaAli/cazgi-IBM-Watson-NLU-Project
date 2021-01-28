const express = require('express');
const dotenv = require('dotenv').config();
const app = new express();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let param = req.query.url;
    results = getNLUInstance().analyze({
        'url': param,
        'features': {
            'entities': {
                'emotion': true,
                'limit': 2
            },
            'keywords': {
                'emotion': true,
                'limit': 2
            }
    }})
    .then(analysisResults => {console.log(JSON.stringify(analysisResults, null, 2));})
    .catch(err => {console.log('error:', err);});
    return res.send(results); //{"happy":"90","sad":"10"}
});

app.get("/url/sentiment", (req,res) => {
    let param = req.query.url;
    results = getNLUInstance().analyze({
        'url': param,
        'features': {
            'entities': {
                'sentiment': true,
                'limit': 2
            },
            'keywords': {
                'sentiment': true,
                'limit': 2
            }
    }})
    .then(analysisResults => {console.log(JSON.stringify(analysisResults, null, 2));})
    .catch(err => {console.log('error:', err);});
    return res.send(results); //"url sentiment for "+req.query.url
});

app.get("/text/emotion", (req,res) => {
    let param = req.query.text;
    results = getNLUInstance().analyze({
        'text': param,
        'features': {
            'entities': {
                'emotion': true,
                'limit': 2
            },
            'keywords': {
                'emotion': true,
                'limit': 2
            }
    }})
    .then(analysisResults => {console.log(JSON.stringify(analysisResults, null, 2));})
    .catch(err => {console.log('error:', err);});
    return res.send(results); //{"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    console.log(req.query.text)
    let param = req.query.text;
    results = getNLUInstance().analyze({
        'text': param,
        'features': {
            'entities': {
                'sentiment': true,
                'limit': 2
            },
            'keywords': {
                'sentiment': true,
                'limit': 2
            }
    }})
    .then(analysisResults => {console.log(JSON.stringify(analysisResults, null, 2));})
    .catch(err => {console.log('error:', err);});
    return res.send(results); //"text sentiment for "+req.query.text
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

