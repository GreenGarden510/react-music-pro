import React, { useEffect, useRef, useState } from 'react'
import { aspectRatioYField } from '../../../containers/Slider/AddSliderForm'
import styles from './index.module.scss'
import logo from './logo.png'

export const Carousel = ({ items, aspect_ratio_x, aspect_ratio_y }) => {
    const [containerWidth, setContainerWidth] = useState(null)
    const [containerHeight, setContainerHeight] = useState(null)
    const [count, setCount] = useState(1)
    const [playing, setPlaying] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [itemsLoaded, setItemsLoaded] = useState(0)
    const [tik, setTik] = useState(0)
    
    //refs
    const containerRef = useRef(null)

    const itemLoaded = () => {
        setItemsLoaded(itemsLoaded + 1)
    }

    const next = () => {
        if (count === items.length) {
            setCount(1)
        } else {
            setCount(count + 1)
        }
    }

    const prev = () => {
        if (count === 1) {
            setCount(items.length)
        } else {
            setCount(count - 1)
        }
    
    
    }

    const handleResize = () => {
        if (aspect_ratio_x && aspect_ratio_y && containerRef.current) {
            // console.log("Fixing carousel sizing issues")
            const width = containerRef.current.clientWidth
            const height = aspect_ratio_y * width/aspect_ratio_x
            // console.log(height)
            setContainerHeight(height)
            setContainerWidth(width)
        }
    }

    useEffect(() => {
        if (!containerRef.current) {
            return
        }
        window.addEventListener('resize', handleResize);
        handleResize()
    }, [])

    useEffect(() => {
        if (loaded) {
            const interval = setInterval(() => {
                setCount(prev => {
                    if (prev === items.length) {
                        return 1
                    } else {
                        return prev + 1
                    }
                })
            }, 5000)
            return () => {
                clearInterval(interval)
            }
        }
    }, [loaded])


    useEffect(() => {
        if (itemsLoaded !== 0 && itemsLoaded === items.length) {
            setLoaded(true)
        }
    }, [itemsLoaded])

    return (
        <div ref={containerRef} style={{ height: containerHeight ?? 'auto' }} className={`${styles.container}`}>
            <div className={`${styles.indicators}`}>
                {items.map((item, index) => (
                    <div key={item} onClick={() => setCount(index + 1)} data-slide-to={index} className={`${index + 1 === count && styles.solid }`}></div>
                ))}
            </div>
            <div className="d-flex">
                {items.map((item, index) => (
                    <div key={item} className={`${styles.item} ${index + 1 === count && styles.active} ${index + 1 < count && styles.previous} ${index + 1 > count && styles.next}`}>
                        <div className={`${styles.wrapper}`}>
                            <img style={{ width: containerWidth, height: containerHeight }} src={item} alt=""/>
                        </div>
                    </div>
                ))}
            </div>
            <div className={`${styles.prevButton}`} onClick={prev}>
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </div>
            <div className={`${styles.nextButton}`} onClick={next}>
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </div>
            {!loaded ? (
              <div className={`${styles.loader}`}>
                <div>
                    <span>Loading...</span>
                </div>
            </div>  
            ) : ""}
            <div className={`${styles.brand}`}>
                <img src={logo} alt="Mkondo Logo" height={containerHeight*0.1} />
            </div>
            {items.map((item) => <img src={item} alt="" style={{ display: "none" }} onLoad={itemLoaded} />)}
        </div>
        // <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
        //     <ol className="carousel-indicators">
        //         {items.map((item, index) => (
        //             <li key={item} data-target="#carouselExampleIndicators" onClick={() => setCount(index + 1)} data-slide-to={index} className={`${index + 1 === count && 'active'}`}></li>
        //         ))}
        //     </ol>
        //     <div className="carousel-inner">
                
        //     </div>
        //     <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev" onClick={prev}>
        //         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        //         <span className="sr-only">Previous</span>
        //     </a>
        //     <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next" onClick={next}>
        //         <span className="carousel-control-next-icon" aria-hidden="true"></span>
        //         <span className="sr-only">Next</span>
        //     </a>
        // </div>
    )
}
