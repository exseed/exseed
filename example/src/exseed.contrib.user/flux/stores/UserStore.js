import alt from '../../../exseed.core/alt';
import UserActions from '../actions/UserActions';

class UserStore {
  constructor() {
    this.bindActions(UserActions);

    if (process.env.BROWSER) {
      // client-side render
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
    } else {
      // server-side render
      this.token = '';
      this.user = {};
    }
  }

  onRegisterSucc(res) {
    console.log('register done');
  }

  onRegisterFail(res) {
    console.log('register fail');
  }

  onLoginSucc(res) {
    this.token = res.data.bearerToken;
    this.user = res.data.user;
    localStorage.setItem('token', this.token);
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  onLoginFail(res) {
    console.log('login fail');
  }

  onLogoutSucc(res) {
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  onLogoutFail(res) {
    console.log('logout fail');
  }
}

export default alt.createStore(UserStore, 'UserStore');