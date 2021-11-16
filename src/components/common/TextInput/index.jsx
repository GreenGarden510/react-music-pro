import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';

const icons = {
  search: require('$assets/images/icons/search.svg'),
  cancel: require('$assets/images/icons/cancel-white.svg'),
};

const TextInput = (props) => {
  // props
  const {
    name,
    type,
    onChange,
    onFocus,
    placeholder,
    value,
    customWrapperClass,
    icon,
    disabled,
    title,
    onIconClick,
    isGrey,
    error,
  } = props;

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // handlers
  const handleChange = (evt) => {
    const { value } = evt.target;
    onChange(name, value);
  }

  // render
  return (
    <>
      <p style={{color: 'white'}}>{t(title)}</p>
      <div className={`d-flex justify-content-center align-items-center ${error ? styles.isInvalid : ''} ${styles.textInputContainer} ${customWrapperClass}  ${isGrey && styles.GreyStyleWrapper}`}>
        <input
          name={name}
          className={`${styles.textInputWrapper} ${isGrey && styles.GreyStyle}`}
          type={type}
          onChange={handleChange}
          onFocus={onFocus}
          value={value}
          placeholder={t(placeholder)}
          disabled={disabled}
        />
        {
          icon && (
            <img
              src={icons[icon]}
              className={styles.textInputIcon}
              onClick={onIconClick}
            />
          )
        }
      </div>
      {error && <p className={styles.invalidFeedback}>{error}</p>}
    </>
  );
};

TextInput.defaultProps = {
  type: 'text', 
  customWrapperClass: '',
  icon: null,
  disabled: false,
  onFocus: () => null,
  onIconClick: () => null,
  title: '',
  value: '',
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  type: PropTypes.string,
  customWrapperClass: PropTypes.string,
  onFocus: PropTypes.func,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  onIconClick: PropTypes.func,
};

export default TextInput;
