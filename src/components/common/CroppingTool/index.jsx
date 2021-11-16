import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './index.module.scss'

const generateDownload = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }
  
    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
  
        const anchor = document.createElement('a');
        anchor.download = 'cropPreview.png';
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
  
        window.URL.revokeObjectURL(previewUrl);
      },
      'image/png',
      1
    );
}

export const CroppingTool = ({ src, aspectRatio, width, locked, onChange }) => {

    const [upImage, setUpImage] = useState(src)
    const imageRef = useRef(null)
    const previewCanvasRef = useRef(null)
    const [crop, setCrop] = useState({ unit:'%', width: width ?? 50, aspect: aspectRatio ?? 16/9 })
    const [completedCrop, setCompletedCrop] = useState(null)

    const onLoad = useCallback((img) => {
            imageRef.current = img
    }, [])

    useEffect(async () => {
        if (!completedCrop || !previewCanvasRef.current || !imageRef.current) {
            return
        }

        const image = imageRef.current
        const canvas = previewCanvasRef.current
        const crop = completedCrop

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const ctx = canvas.getContext('2d')
        const pixelRatio = window.devicePixelRatio

        canvas.width = crop.width * pixelRatio
        canvas.height = crop.height * pixelRatio

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        ctx.imageSmoothingQuality = 'high'

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        )

        await canvas.toBlob(blob => onChange(blob), 'image/jpeg', 1)
    }, [completedCrop])

    return (
        <div className={`${styles.wrapper}`}>
            <ReactCrop
                src={upImage}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                locked={locked}
            />
            {/* <button onClick={() => generateDownload(previewCanvasRef.current, completedCrop)}>download</button> */}
            <div>
                <canvas
                    ref={previewCanvasRef}
                    // Rounding is impontant so that the canvas widht and height matches / is a multiple for sharpness
                    style={{ 
                        display: "none",
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)
                    }}
                />
            </div>
        </div>
    )
}
