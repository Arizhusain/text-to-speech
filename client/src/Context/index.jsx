import PropTypes from 'prop-types';
import { createContext, useContext, useState } from "react";
import { messageText } from './message';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

const AudioProvider = (props) => {
    const [settingsSaved, setSettingsSaved] = useState(false);
    const [text, setText] = useState(messageText);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState(null);
    const [voiceTypeCloned, setVoiceTypeCloned] = useState(false);
    const [aIvoiceFullList, setAIvoiceFullList] = useState([]);
    const [voiceList, setVoiceList] = useState([]);
    const [clonedVoiceList, setClonedVoiceList] = useState([]);
    const [clonedVoice, setClonedVoice] = useState([]);
    const [clonedVoiceName, setClonedVoiceName] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState("s3://voice-cloning-zero-shot/e5df2eb3-5153-40fa-9f6e-6e27bbb7a38e/original/manifest.json");
    const [audioFile, setAudioFile] = useState('https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/1.mp3');
    const player = new Audio(audioFile)
    player.setAttribute('preload', 'metadata')
    return (
        <AudioContext.Provider value={{
            player,
            language,
            setLanguage,
            voiceTypeCloned,
            setVoiceTypeCloned,
            voiceList,
            clonedVoice,
            setClonedVoice,
            setVoiceList,
            audioFile,
            setAudioFile,
            selectedVoice,
            setSelectedVoice,
            settingsSaved,
            setSettingsSaved,
            loading,
            setLoading,
            text,
            setText,
            clonedVoiceList,
            setClonedVoiceList,
            clonedVoiceName,
            setClonedVoiceName,
            aIvoiceFullList,
            setAIvoiceFullList
        }}>
            {props.children}
        </AudioContext.Provider>
    )
}

AudioProvider.propTypes = {
    children: PropTypes.object
};

export default AudioProvider;