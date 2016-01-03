import alt from '../../../exseed.core/alt';
import apiRequest from '../utils/apiRequest';

class UserActions {
  constructor() {
    this.generateActions(
      'registerSucc',
      'registerFail',
      'loginSucc',
      'loginFail',
      'logoutSucc',
      'logoutFail',
    );
  }

  register(input) {
    return apiRequest({
      method: 'POST',
      url: '/api/user',
      data: input,
      succ: (res) => {
        this.actions.registerSucc(res);
        location.href = '/user/login';
      },
      fail: this.actions.registerFail,
    });
  }

  login(input) {
    return apiRequest({
      method: 'POST',
      url: '/api/user/login',
      data: input,
      succ: (res) => {
        this.actions.loginSucc(res);
        location.href = '/';
      },
      fail: this.actions.loginFail,
    });
  }

  logout() {
    return apiRequest({
      method: 'GET',
      url: '/api/user/logout',
      succ: (res) => {
        this.actions.logoutSucc(res);
        location.href = '/';
      },
      fail: this.actions.logoutFail,
    });
  }
}

export default alt.createActions(UserActions);