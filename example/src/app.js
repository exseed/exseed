import * as exseed from 'exseed';

exseed.registerApp('core', './exseed.core');
exseed.registerApp('basic', './exseed.contrib.basic');
exseed.registerApp('user', './exseed.contrib.user');
exseed.registerApp('todo', './todoapp');

export default exseed;