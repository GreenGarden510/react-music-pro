import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { handleFetch } from '../../../common/requestUtils'
import { selectAllSliderPictures } from '../../../redux/features/slider'
import { Item } from './item'

export const SliderPictureList = ({ slider_id }) => {
    const pictures = useSelector(state => selectAllSliderPictures(state, slider_id))
    
    return (
        <div className="row g-5">
            { pictures.map(item => (
                <div className="col-lg-3">
                    <Item key={item.slider_item_id} item={item} />
                </div>
            )) }
        </div>
    )
}
