import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { routePaths } from '../../../common/routeConfig'
import Button from '../../../components/common/Button'
import { deleteSlider, fetchSliders, selectAllSliders } from '../../../redux/features/slider'
import styles from './index.module.scss'

export const SliderList = () => {

    const sliders = useSelector(selectAllSliders)
    const status = useSelector(store => store.slider.status)
    
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchSliders())
        }
    }, [dispatch, status])

    return (
        <div className={`${styles.container}`}>
            <div className="row">
                <div className="col-lg-auto"><h1 className="heading-2">Sliders</h1></div>
                <div className="col-auto ml-auto">
                    <Button onClick={() => history.push(routePaths.sliderCreate)}>Add Slider</Button>
                </div>
            </div>

            {status == 'loading' ? <p>Loading...</p> : (status === 'failed' ? <Button onClick={() => dispatch(fetchSliders())}>Reload!</Button> : '')}

            <div className="row mt-5">
                {sliders.map(slider => (
                    <div className="col-lg-4" key={`${slider.slider_id}`}>
                        <div className={`${styles.card}`}>
                            <div>
                                <h5 className="text-center">{slider.name}</h5>
                                <div className={`${styles.actions}`}>
                                    <span onClick={() => history.push(routePaths.sliderShow.replace(':slider_id', slider.slider_id))}>View</span>
                                    <span onClick={() => history.push(routePaths.sliderEdit.replace(':slider_id', slider.slider_id))}>Edit</span>
                                    <span onClick={() => dispatch(deleteSlider(slider.slider_id))}>Delete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
