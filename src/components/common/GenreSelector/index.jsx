import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from '$components/common/Button';
import menus, { newMedia } from './menus';

const happyFace = require('$assets/images/home/happy-face.svg');

import styles from './index.module.scss';

const GenreSelector = (props) => {
  // props
  const {
    handleNext,
    handleSelect,
    selected,
    type,
    title,
    subtitle,
  } = props;

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  const source = type === 'media' ? newMedia : menus;

  // render
  return (
    <div className="row justify-content-center">
      <div className={`col-10 col-sm-8 ${styles.genreSelectorContent}`}>
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={happyFace}
            alt="Happy Face"
          />
          <div className={styles.genreSelectorHeaderWrapper}>
            <div className={styles.genreSelectorHeader}>{title}</div>
            <div>{subtitle}</div>
          </div>
        </div>
        <div className={`d-flex flex-wrap justify-content-center ${styles.genreSelectorMenus}`}>
          {
            source.map((menu) => {
              const isActive = selected.indexOf(menu.name) > -1 ? styles.genreSelectorMenuActive : '';
              const icon = isActive ? menu.iconActive : menu.icon;
              return (
                <div
                  className={`d-flex flex-column justify-content-center align-items-center ${styles.genreSelectorMenu} ${isActive}`}
                  key={`genreSelector-${menu.name}`}
                  onClick={() => handleSelect(menu.name)}
                >
                  <div className={`d-flex justify-content-center align-items-center ${styles.genreSelectorMenuImage}`}>
                    <img
                      src={icon}
                      className={styles.icon}
                      alt=""
                    />
                  </div>
                  <span style={{fontSize: '1.4rem'}}>{t(menu.title)}</span>
                </div>
              )
            })
          }
        </div>
        <div className="d-flex justify-content-center my-4">
          <Button
            onClick={handleNext}
            isRed
            noBorder
            isSquare
          >
            {t('continue')}
          </Button>
        </div>
      </div>
    </div>
  );
}

GenreSelector.defaultProps = {
  selected: [],
  type: 'on-boarding',
  title: 'We are Happy to have you here...',
  subtitle: ''
};

GenreSelector.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default GenreSelector;
