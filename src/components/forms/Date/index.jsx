import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const defaultDate = new Date();

const InputDate = (props) => {
  // props
  const {
    title,
    name,
    onChange,
    value,
    error,
  } = props;

  // handlers
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    onChange(name, value);
  }

  // render
  return (
    <div className="form-group">
      <p style={{color: 'white'}}>{title}</p>
      <div className="d-flex flex-column custom-date-wrapper">
        <input
          name={name}
          className={`custom-date ${error && 'isInvalid'}`}
          type="date"
          onChange={handleChange}
          value={value || defaultDate}
        />
        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>
    </div>
  )
}

InputDate.defaultProps = {
  title: '',
}

InputDate.propTypes = {
  title: PropTypes.string,
}

export default InputDate;
