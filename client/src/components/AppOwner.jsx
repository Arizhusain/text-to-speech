import Settings from './Settings'
import Player from './Player'
import { useAudio } from '../Context';
import Loading from './Loading';
import { useEffect } from 'react';

const AppOwner = () => {
    const audio = useAudio();
    useEffect(() => {
        console.log(audio.loading);
    }, [audio.loading])
    return (
        <>
            <>
                {audio?.loading ?
                    <Loading /> : null
                }
                {!audio?.loading ?
                    audio?.settingsSaved ?
                        <>
                            <div className='align-center-classname'>
                                <button className="btn-cancel" onClick={() => audio.setSettingsSaved(false)}>Go Back</button>
                            </div>
                            <Player />
                        </>
                        :
                        <Settings />
                    : null
                }

            </>
        </>
    )
}

export default AppOwner