import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';


const Checkbox = (props) => {
  // props
  const {
    title,
    name,
    onChange,
    value,
  } = props;

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // handlers
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    onChange(name, value);
  }

  // render
  return (
    <div className="form-group">
      <div className="form-check">
        <input
          name={name}
          className="form-check-input"
          type="checkbox"
          id="gridCheck"
          onChange={handleChange}
          value={value}
        />
        <label
          className="form-check-label"
          htmlFor="gridCheck"
        >
          {t(title)}
        </label>
      </div>
    </div>
  )
}

Checkbox.defaultProps = {
  title: '',
}

Checkbox.propTypes = {
  title: PropTypes.string,
}

export default Checkbox;
