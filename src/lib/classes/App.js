/** Exseed application class */
class App {
  /**
   * Generates a new express app,
   * and mount it onto the top level express app
   * @param {object} props - constructor arguments
   */
  constructor(props) {
    /**
     * The express app
     * @member App#expressApp
     */
    this.expressApp = props.app;
    /**
     * Exseed app name
     * @member App#name
     */
    this.name = props.name;
    /**
     * Exseed app directory
     * @member App#dir
     */
    this.dir = props.dir;
    props.rootApp.use('/', this.expressApp);
  }

  /**
   * Initialization lifecycle
   * @member App#init
   * @function
   * @param {Models} models
   */
  init(models) {
  }

  routing(app, models) {
  }

  onError(err, req, res) {
  }

  onErrorEnd(err, req, res) {
  }

  /**
   * Export anything of this app
   * @member App#getModules
   * @function
   */
  getModules() {
    return {};
  }
}

export default App;