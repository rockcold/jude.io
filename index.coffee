
http = require 'http'

OPTS = {
    host:   'jude.io',
    port:   443,
    prefix: '/api/1.0/',
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'User-Agent': 'Jude-Node/1.0.0'}
}

class exports.Jude
    constructor: (@apikey=null, @debug=false) ->
        @email = new Email(this)

        if @apikey == null then @apikey = process.env['Jude_APIKEY']

    call: (uri, params={}, onresult, onerror) ->
        params.key = @apikey
        params = new Buffer(JSON.stringify(params), 'utf8')

        if @debug then console.log("Jude: Opening request to http://#{OPTS.host}#{OPTS.prefix}#{uri}.json")
        OPTS.path = "#{OPTS.prefix}#{uri}.json"
        OPTS.headers['Content-Length'] = params.length
        req = http.request(OPTS, (res) =>
            res.setEncoding('utf8')
            json = ''
            res.on('data', (d) =>
                json += d
            )

            res.on('end', =>
                try
                    json = JSON.parse(json)
                catch e
                    json = {status: 'error', name: 'GeneralError', message: e}
                
                json ?= {status: 'error', name: 'GeneralError', message: 'An unexpected error occurred'}
                if res.statusCode != 200
                    if onerror then onerror(json) else @onerror(json)
                else
                    if onresult then onresult(json)
            )
        )
        req.write(params)
        req.end()
        req.on('error', (e) =>
            if onerror then onerror(e) else @onerror({status: 'error', name: 'GeneralError', message: e})
        )

        return null

    onerror: (err) ->
        throw {name: err.name, message: err.message, toString: -> "#{err.name}: #{err.message}"}

class Email
    constructor: (@master) ->


    ###
    Get the list of custom metadata fields indexed for the account.
    @param {Object} params the hash of the parameters to pass to the request
    @param {Function} onsuccess an optional callback to execute when the API call is successfully made
    @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    ###
    send: (params={}, onsuccess, onerror) ->
        if typeof params == 'function'
            onerror = onsuccess
            onsuccess = params
            params = {}


        @master.call('email/send', params, onsuccess, onerror)

