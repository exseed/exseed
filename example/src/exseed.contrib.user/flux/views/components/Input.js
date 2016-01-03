import React from 'react';
import classNames from 'classnames';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  /**
   * Public Methods
   */
  getValue() {
    return this.state.value;
  }

  /**
   * Private Methods
   */
  _handleInputChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const labelClass = classNames(
      this.props.labelClassName,
      'control-label'
    );
    const inputClass = classNames(
      this.props.inputClassName
    );

    return (
      <div className="form-group">
        <label className={labelClass}>
          {this.props.label}
        </label>

        <div className={inputClass}>
          <input
            type={this.props.type}
            className="form-control"
            placeholder={this.props.placeholder}
            value={this.state.value}
            onChange={this._handleInputChange.bind(this)} />
        </div>
      </div>
    );
  }
};

Input.propTypes = {
  type: React.PropTypes.oneOf([
    'text',
    'password',
    'textarea',
    'checkbox',
  ]),
  label: React.PropTypes.string,
  labelClassName: React.PropTypes.string,
  inputClassName: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  value: React.PropTypes.any,
};

Input.defaultProps = {
  type: 'text',
  disabled: false,
  labelClassName: 'col-sm-2',
  inputClassName: 'col-sm-10',
};