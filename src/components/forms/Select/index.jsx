import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Select from 'react-select';

const SelectInput = (props) => {
  // props
  const {
    title,
    options,
    onChange,
    isMulti,
    value,
    placeholder,
    name,
    isGrey,
    error,
  } = props;

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // handler
  const handleChange = (value, item) => {
    onChange(item.name, value);
  }
  console.log('[isGrey]', isGrey);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: isGrey? 'white': '',
      backgroundColor: isGrey? '#818181': ''
    }),
    control: (provided, state) => ({
      ...provided,
      color: isGrey? 'white': '',
      backgroundColor: isGrey? '#818181': '',
      borderColor: error ? 'red' : '',
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: isGrey? 'white': '',
    }),
  }

  // render
  return (
    <>
      <p style={{color: 'white'}}>{t(title)}</p>
      <Select
        name={name}
        options={options}
        onChange={handleChange}
        value={value}
        isMulti={isMulti}
        placeholder={t(placeholder)}
        styles={customStyles}
      />
      {error && <p style={{color: 'red'}}>{t(error)}</p>}
    </>
  );
}

export default SelectInput;
