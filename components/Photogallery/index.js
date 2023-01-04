import { useCallback, useEffect, useRef, useState } from 'react'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import clamp from 'lodash.clamp'
import { Enlarge, Shrink } from '../Icons'
import { useSnapshot } from 'valtio'
import { state } from '../../store'

export default function PhotoGallery({
    photos,
}) {
    const index = useRef(0)
    const width = typeof window !== "undefined" ? window.innerWidth : 500

    const [reload, setReload] = useState(0)

    const [props, api] = useSprings(photos.length, i => ({
        x: i * width,
        scale: 1,
        i: 0,
        display: 'block',
    }))
    const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
        if (active && Math.abs(mx) > width / 2) {
            index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, photos.length - 1)
            cancel()
        }
        api.start(i => {
            if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }
            const x = (i - index.current) * width + (active ? mx : 0)
            const scale = active ? 1 - Math.abs(mx) / width / 2 : 1
            return { x, i: index.current === i ? 1:0.5, scale, display: 'block' }
        })
    })

    //reset carousel hack
    useEffect(() => {
        console.log("reeees")
        api.stop()
        index.current = 0

        api.start(i => {
            if (i == 0) {
                return { x: 0, scale: 1, i: 1,display: "block" }
            }
            const x = i * width
            return { x, scale: 1, i:0.5,display: "none" }
        })
        setReload(cur => cur + 1)
    }, [photos]);

    const ui = useSnapshot(state)

    const onToggleFullscreen = useCallback(() => {
        state.fullscreen=!state.fullscreen
    }, [])

    return (
        <div style={{
            minHeight: "100%",
            height:"100%",
            width: "100%",
            left: 0,
            right: 0,
            top: 0,
            position: ui.fullscreen ? "fixed" : "relative",
            background: "#121212",
            overflow:"hidden",
        }}
            key={reload}
        >
            {props.map(({ x, display, scale }, i) => (
                <animated.div {...bind()} key={i} style={{ position: "absolute", width: "100%", height: "100%", display, x }}>
                    <animated.div style={{ 
                        touchAction: "none", 
                        width: "100%", 
                        height: "100%", 
                        scale, 
                        backgroundImage: `url(${photos[i]})`, 
                        backgroundSize: "contain",
                        backgroundRepeat:"no-repeat",
                        backgroundPosition:"center center" }} />
                </animated.div>
            ))}

            <div className="flex flex-center" style={{
                position: "absolute",
                bottom: "2em",
                width:"50%",
                left:"25%",
                textAlign:"center",
                color: "white",
            }}>
                {props.map(({ x, display, scale, i: index }, i) => (
                <animated.div key={i} style={{ 
                    width: 8,
                    height: 8,
                    background:"#fff",
                    opacity: index,
                    marginLeft:2,
                    marginRight:2,
                    borderRadius:"50%",
                 }}>
                </animated.div>
            ))}
            </div>

            <div style={{
                position: "absolute",
                bottom: "0.5em",
                right: "0em",
                color: "white",
            }}>
                <button className="button button-ghost" onClick={onToggleFullscreen}>
                {!ui.fullscreen ? <Enlarge /> : <Shrink />}
                </button>
            </div>
        </div>
    )
}
