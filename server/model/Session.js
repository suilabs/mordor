let uuid = require('uuid/v4');
let addMinutes = require('date-fns/add_minutes');

let SessionModel = require('./schemas/session');

class Session {
  constructor({ ttl, ip, browser }) {
    this.token = uuid();
    this.session = new SessionModel({
      current_token: this.token,
      original_token: this.token,
      ip,
      browser,
      ttl: addMinutes(Date.now(), ttl),
    });
    this.object = this.session.toObject();
  }

  static restore({ ip, browser, token }) {
    const session = SessionModel.find({ ip, browser, current_token: token });
    return session[0];
  }

  getToken() {
    return this.object.current_token;
  }

  generateNewToken() {

  }

  getTTL() {
    return this.object.ttl;
  }

  getBrowser() {
    return this.object.browser;
  }

  getIP() {
    return this.object.ip;
  }

  store() {
    this.session.save();
  }
}

module.exports = Session;