let express = require('express')
let request = require('request')
let querystring = require('querystring')
 let app = express()
 let redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/callback'

 app.get('/login', function(req, res) {
  res.redirect('https://github.com/login/oauth/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.GITHUB_CLIENT_ID,
      scope: 'repo notifications read:discussion',
      redirect_uri
    }))
})
 app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://github.com/login/oauth/access_token',
    form: {
      code: code,
      // redirect_uri,
      // grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.GITHUB_CLIENT_ID + ':' + process.env.GITHUB_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token)
  })
})
 let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)
