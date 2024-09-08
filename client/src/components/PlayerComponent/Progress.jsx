import { useEffect, useRef, useState } from "react"
import { useAudio } from "../../Context"

const Progress = (props) => {
    let [currLength, setCurrLength] = useState(0)
    let [length, setLength] = useState(0)
    const progressBar = document.querySelector('.progressBar')
    const audio = useAudio();
    const progressRef = useRef(null);

    function updateProgress(e) {
        let offset = e.target.getBoundingClientRect().left
        let newOffSet = e.clientX
        let newWidth = newOffSet - offset
        progressBar.style.width = newWidth + "px"
        let secPerPx = length / 280
        audio.player.currentTime = secPerPx * newWidth
    }

    useEffect(() => {
        setInterval(() => {
            setLength(Math.ceil(audio.player.duration))
            setCurrLength(Math.ceil(audio.player.currentTime))
            let secPerPx = Math.ceil(audio.player.duration) / 280
            let newWidth = audio.player.currentTime / secPerPx
            if (progressRef?.current?.style?.width) {
                progressRef.current.style.width = newWidth + "px";
            }
            if (audio.player.currentTime === audio.player.duration) {
                audio.player.pause();
                props.setPlayState(false)
            }
        }, 1000);
        return () => {
            clearInterval();
        }
    }, []);

    function formatTime(s) {
        return Number.isNaN(s) ? '0:00' : (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
    }

    return (
        <div className="progress">
            <div className="currentTime">
                <p>{formatTime(currLength)}</p>
            </div>
            <div
                className="progressCenter"
                onClick={(e) => updateProgress(e)}>
                <div className="progressBar" ref={progressRef} style={{ width: 500 }}>
                </div>
            </div>
            <div className="songLength">
                <p>{formatTime(length)}</p>
            </div>
        </div>
    );
}

export default Progress

