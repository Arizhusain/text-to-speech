import { useEffect, useState } from 'react'
import Progress from './Progress';
import Control from './Control';
import { useAudio } from '../../Context';

const Container = () => {
    const audio = useAudio();
    let [idx, setIdx] = useState(0);
    let [playState, setPlayState] = useState(false);
    useEffect(() => {
        if (playState === true)
            audio.player.play()
        else
            audio.player.pause()

    }, [playState])

    return (
        <div className="playerContaier">
            <h1>Audio++</h1>
            <br />
            <Progress
                setIdx={setIdx}
                idx={idx}
                setPlayState={setPlayState}
            />
            <Control
                setIdx={setIdx}
                idx={idx}
                playState={playState}
                setPlayState={setPlayState} />
        </div>
    );
}

export default Container
