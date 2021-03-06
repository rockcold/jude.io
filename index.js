// Generated by CoffeeScript 1.6.2
(function() {
  var Email, OPTS, http;

  http = require('http');

  OPTS = {
    host: 'jude.io',
    port: 443,
    prefix: '/api/1.0/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Jude-Node/1.0.0'
    }
  };

  exports.Jude = (function() {
    function Jude(apikey, debug) {
      this.apikey = apikey != null ? apikey : null;
      this.debug = debug != null ? debug : false;
      this.email = new Email(this);
      if (this.apikey === null) {
        this.apikey = process.env['Jude_APIKEY'];
      }
    }

    Jude.prototype.call = function(uri, params, onresult, onerror) {
      var req,
        _this = this;

      if (params == null) {
        params = {};
      }
      params.key = this.apikey;
      params = new Buffer(JSON.stringify(params), 'utf8');
      if (this.debug) {
        console.log("Jude: Opening request to http://" + OPTS.host + OPTS.prefix + uri + ".json");
      }
      OPTS.path = "" + OPTS.prefix + uri + ".json";
      OPTS.headers['Content-Length'] = params.length;
      req = http.request(OPTS, function(res) {
        var json;

        res.setEncoding('utf8');
        json = '';
        res.on('data', function(d) {
          return json += d;
        });
        return res.on('end', function() {
          var e;

          try {
            json = JSON.parse(json);
          } catch (_error) {
            e = _error;
            json = {
              status: 'error',
              name: 'GeneralError',
              message: e
            };
          }
          if (json == null) {
            json = {
              status: 'error',
              name: 'GeneralError',
              message: 'An unexpected error occurred'
            };
          }
          if (res.statusCode !== 200) {
            if (onerror) {
              return onerror(json);
            } else {
              return _this.onerror(json);
            }
          } else {
            if (onresult) {
              return onresult(json);
            }
          }
        });
      });
      req.write(params);
      req.end();
      req.on('error', function(e) {
        if (onerror) {
          return onerror(e);
        } else {
          return _this.onerror({
            status: 'error',
            name: 'GeneralError',
            message: e
          });
        }
      });
      return null;
    };

    Jude.prototype.onerror = function(err) {
      throw {
        name: err.name,
        message: err.message,
        toString: function() {
          return "" + err.name + ": " + err.message;
        }
      };
    };

    return Jude;

  })();

  Email = (function() {
    function Email(master) {
      this.master = master;
    }

    /*
    Get the list of custom metadata fields indexed for the account.
    @param {Object} params the hash of the parameters to pass to the request
    @param {Function} onsuccess an optional callback to execute when the API call is successfully made
    @param {Function} onerror an optional callback to execute when the API call errors out - defaults to throwing the error as an exception
    */


    Email.prototype.send = function(params, onsuccess, onerror) {
      if (params == null) {
        params = {};
      }
      if (typeof params === 'function') {
        onerror = onsuccess;
        onsuccess = params;
        params = {};
      }
      return this.master.call('email/send', params, onsuccess, onerror);
    };

    return Email;

  })();

}).call(this);
