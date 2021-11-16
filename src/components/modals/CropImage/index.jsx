import React, { useEffect } from 'react'
import { CroppingTool } from '../../common/CroppingTool/index';
import { useSelector, useDispatch } from 'react-redux';
import { updateCroppedImage, updateSlung } from '../../../redux/features/croptool';
import { getFileURL } from '$common/utils';
import Button from '../../common/Button/index';
import { hideModal } from '$redux/features/modal';

export const CropImageModal = ({
    src,
    aspectRatio,
    width,
    locked,
    slung,
}) => {
    //redux
    const dispatch = useDispatch();
    // aspectRatio, width, locked, onChange
    //redux
    // const modalProps = useSelector((store) => store.modal.modalProps);

    useEffect(() => {
        if (!slung) return;
        dispatch(updateSlung(slung))
    }, [slung]);

    return (
        <div className="row">
            <div className="col-md-auto mx-auto mb-3">
                <h3>Image Cropping</h3>
                <CroppingTool 
                    src={src}
                    aspectRatio={aspectRatio} 
                    width={width} 
                    locked={locked} 
                    onChange={(blob) => {
                        let fileUrl = getFileURL(blob)
                        console.log("Image Cropped", fileUrl);
                        dispatch(updateCroppedImage(fileUrl));
                }} />
                <Button onClick={() => dispatch(hideModal())}>Done</Button>
            </div>
        </div>
    )
}
