const config = require('./config.json');
const axios = require('axios');
const querystring = require('querystring');

exports.kgSearch = (req, res) => {
    return Promise.resolve()
        .then(() => {
            if (req.method !== 'POST') {
                const error = new Error('Only POST requests are accepted');
                error.code = 405;
                throw error;
            }

            return makeSearchRequest(req.body.text);
        })
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            console.error(err);
            res.status(err.code || 500).send(err);
            return Promise.reject(err);
        });
};

function makeSearchRequest(query) {
    return  axios.get(`https://kgsearch.googleapis.com/v1/entities:search?${querystring.stringify(
        {
            query: query,
            key: config.KG_API_KEY,
            limit: 1,
            indent: true
        })}`)
        .then(response => {return response.data.itemListElement[0].result.image.contentUrl})

}
