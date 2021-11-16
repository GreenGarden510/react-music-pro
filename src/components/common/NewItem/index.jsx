import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import TabsArtist from '$components/common/TabsArtist';
import InputField from '$components/forms/InputField';
import AvatarInput from '$components/common/AvatarInput';
import Progress from '$components/common/Progress';

import { generatePreview } from '$common/utils';

import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '$redux/features/modal';
import { crop } from '../../../redux/features/croptool';

const options = [
  { name: 'basic', title: 'basic' },
  { name: 'metadata', title: 'metadata' },
]

const NewItem = (props) => {
  // props
  const {
    menus,
    metamenus,
    onChange,
    values,
  } = props;

  // console.log(menus);

  // state
  const [selected, setSelected] = useState(options[0].name);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // redux
  const croppedImage = useSelector((state) => state.croptool.cropped)
  const dispatch = useDispatch();

  useEffect(async () => {
    const file = await fetch(croppedImage).then(res => res.blob());
    const url = await generatePreview(file)
    setAvatarUrl(url);
    onChange('file', file);
  }, [croppedImage]);

  // handlers
  const handleSelect = (item) => {
    setSelected(item);
  }

  const handleAvatarChange = async (file) => {
    const url = await generatePreview(file[0]);
    dispatch(crop({
      src: url,
      aspectRatio: 1/1,
      width: 100, 
      locked: true,
    }));
  }

  // render
  return (
    <div className="">
      <div className="d-flex flex-column mt-4">
        <Progress
          values={values}
        />
      </div>
      <div  className={styles.newContent}>
        {/* <div className="d-flex flex-column mt-4">
          <TabsArtist
            options={options}
            onSelect={handleSelect}
            selected={selected}
            name="newItem"
            activeColor="#8C8C8C"
          />
        </div> */}
        <div className={`row mt-4 ${selected === 'basic' ? '' : 'd-none'}`}>
          <div className="col-12 col-md-6 col-lg-5">
            <div className={styles.avatar}>
              <AvatarInput
                url={avatarUrl}
                onChange={handleAvatarChange}
              />
            </div>
            {
              menus.map((menu, idx) => (
                menu.type == 'area' && <div className="" key={`new-item-menu-${idx}`}>
                  <InputField
                    field={{
                      ...menu,
                      value: values[menu.name]
                    }}
                    isGrey
                    onChange={onChange}
                  />
                </div>
              ))
            }
          </div>
          <div className="col-12 col-md-6 col-lg-7">
            {
              menus.map((menu, idx) => (
                menu.type != 'area' && menu.name != 'policy' && <div className="" key={`new-item-menu-${idx}`}>
                  <InputField
                    field={{
                      ...menu,
                      value: values[menu.name]
                    }}
                    isGrey
                    onChange={onChange}
                  />
                </div>
              ))
            }
          </div>
          <div className="col-12 col-md-6 col-lg-12">
            {
              menus.map((menu, idx) => (
                menu.name == 'policy' && <div className="" key={`new-item-menu-${idx}`}>
                  <InputField
                    field={{
                      ...menu,
                      value: values[menu.name]
                    }}
                    isGrey
                    onChange={onChange}
                  />
                </div>
              ))
            }
          </div>
        </div>
        <div className={`d-flex flex-wrap mt-4 ${selected === 'metadata' ? '' : 'd-none'}`}>
          {
            metamenus.map((menu, idx) => (
              <div
                className=""
                key={`new-item-menumetas-${idx}`}
              >
                <InputField
                  field={{
                    ...menu,
                    value: values[menu.name]
                  }}
                  isGrey
                  onChange={onChange}
                />
              </div>
            ))
          }
        </div>
        <div className="d-flex justify-content-end">
          {selected == "basic" && <button className="btn btn-primary" onClick={() => handleSelect(options[1].name)}>Next</button>}
          {selected == "metadata" && <button className="btn btn-warning" onClick={() => handleSelect(options[0].name)}>Previous</button>}
        </div>
      </div>
    </div>
  );
}

NewItem.defaultProps = {
  title: 'Create Artist',
};

NewItem.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default NewItem;
