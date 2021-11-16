import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const TextArea = (props) => {
  // props
  const {
    name,
    value,
    onChange,
    placeholder,
    title,
    isGrey,
    error
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
    <>
      <p style={{color: 'white'}}>{t(title)}</p>
      <div className={`${styles.formTextAreaWrapper} ${error ? styles.isInvalid : ''}`}>
        <textarea
          name={name}
          className={`${styles.formTextArea} ${isGrey?styles.textareaGrey:''}`}
          value={value}
          onChange={handleChange}
          placeholder={t(placeholder)}
          rows={1}
        />
      </div>
      <p className={styles.invalidFeedback}>{error}</p>
    </>
  );
}

TextArea.defaultProps = {
  title: '',
  value: '',
}

TextArea.propTypes = {
  placeholder: PropTypes.string.isRequired,
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default TextArea;
