import { useEffect, useState } from "react";
import { useAudio } from "../Context";
import { callingTranslateApi, deleteClonedVoice, getAIClonedVoices, getAllVoice, playHtApiCall, playHtApiCall2 } from "../server";
import axios from "axios";
// import { messageText } from "../Context/message";
// import '../App.css'

const Settings = () => {
    const [file, setFile] = useState();
    const [messageText, setMessageText] = useState('A cell is a mass of cytoplasm that is bound externally by a cell membrane. Usually microscopic in size, cells are the smallest structural units of living matter and compose all living things. Most cells have one or more nuclei and other organelles that carry out a variety of tasks.');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [languages, setLanguages] = useState([]);
    const [langVoiceList, setLangVoiceList] = useState([]);
    const audio = useAudio();


    const getAIvoices = async () => {
        const data = await getAllVoice();
        // const aiVoices = data.slice(0, 50);
        const aiVoices = data;
        console.log(aiVoices);
        audio.setVoiceList(aiVoices);
        const tempLanguages = data.filter((item) => item.voiceEngine === "Standard" && item.languageCode === 'en-US');
        setLangVoiceList(tempLanguages)
        const languagesWithCodes = [...new Set(aiVoices.map(voice => JSON.stringify({ language: voice.language, languageCode: voice.languageCode })))].map(item => JSON.parse(item));
        console.log(languagesWithCodes);
        setLanguages(languagesWithCodes);
    }
    const getAIClonedvoices = async () => {
        const data = await getAIClonedVoices();
        const aiVoices = data.slice(0, 50);
        console.log(aiVoices);
        audio.setClonedVoiceList(aiVoices);
    }

    const getTranslatedtext = async () => {
        if (audio.language !== null && audio.language !== 'en') {
            const translatedText = await callingTranslateApi(messageText, audio.language);
            console.log(translatedText);
            audio.setText(translatedText);
        }
    }


    useEffect(() => {
        audio.setText(messageText);
        audio.setLanguage('en');
        getAIvoices();
        getAIClonedvoices();
    }, [])
    useEffect(() => {
        getTranslatedtext();
    }, [audio.language])

    // useEffect(()=>{
    //     getAIClonedvoices();
    // },[audio.clonedVoiceList])

    const handleLanguageChange = (e) => {
        console.log(e.target.value);
        audio.setLanguage(e.target.value);
        const tempLanguages = audio.voiceList.filter((item) => item.voiceEngine === "Standard" && item.languageCode === e.target.value);
        setLangVoiceList(tempLanguages);
    }
    const handleDefaultSelect = (e) => {
        audio.setSelectedVoice(e.target.value);
    }

    const callTextToSpeechAPI = async (isCloned) => {
        if (isCloned) {
            console.log(audio.text, audio.selectedVoice);
            const newAudio = await playHtApiCall2(audio.text, audio.selectedVoice, audio.language);
            audio.setAudioFile(newAudio);
            audio.setLoading(false);
        } else {
            console.log(audio.text, audio.selectedVoice);
            const newAudio = await playHtApiCall(audio.text, audio.selectedVoice, audio.language);
            audio.setAudioFile(newAudio.file);
            audio.setLoading(false);
        }
    }

    const fileUploadClone = async () => {
        const url = 'http://localhost:5000/upload_voice';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('voiceName', audio.clonedVoiceName);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
            onUploadProgress: function (progressEvent) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        };
        await axios.post(url, formData, config)
            .then((response) => {
                console.log(response);
                audio.setLoading(false);
            })
            .catch((error) => {
                console.error("Error uploading file: ", error);
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        audio.setLoading(true);
        if (audio.voiceTypeCloned && !audio.clonedVoiceList.length) {
            fileUploadClone();
        } else if (!audio.voiceTypeCloned && audio.voiceList.length) {
            callTextToSpeechAPI();
            audio.setSettingsSaved(true);
        } else if (audio.voiceTypeCloned && audio.clonedVoiceList.length) {
            callTextToSpeechAPI(true);
            audio.setSettingsSaved(true);
        }
    }

    const handleFileChange = (e) => {
        e.preventDefault();
        setFile(e.target.files[0]);
    }
    const handleInputChange = (e) => {
        e.preventDefault();
        audio.setClonedVoiceName(e.target.value);
    }

    const handleClickDelete = async (e) => {
        e.preventDefault();
        audio.setLoading(true);
        const data = await deleteClonedVoice();
        if (data) {
            audio.setClonedVoiceName([])
            audio.setLoading(false);
        }
    }

    const handleTextArea = (e) => {
        setMessageText(e.target.value);
        audio.setText(e.target.value);
        // console.log(e.target.value);
    }
    return (
        <>
            <textarea name="textarea" id="textarea" value={messageText} className="mynewtextarea" onChange={handleTextArea}>
            </textarea>
            <form action="" onSubmit={handleSubmit}>
                <div className="container">
                    <nav>
                        <h1 className="settingsP">Settings</h1>
                        <div className="close-box">
                            <i className="fa-solid fa-xmark"></i>
                            <p className="closeP">Close</p>
                        </div>
                    </nav>
                    <div className="main">
                        <div className="above-hr">
                            <h5 className="languageP">Language</h5>
                            <p className="languagePP">Let us know which language youre most comfortable using. You can change it back at any time. <strong>(Default: English)</strong></p>
                            <div className="language-box">
                                <select name="" id="" onChange={handleLanguageChange}>
                                    {
                                        languages.map((item, index) => (
                                            <option key={index} value={item.languageCode} className="option1">{item.language}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        <hr />
                        <div className="under-hr">
                            <div className="autoplay-box">
                                <div className="autoplay-caption">
                                    <h5 className="autoplayP">Use custom voice?</h5>
                                    <p className="autoplayPP">Choose yes if you wish to use custom voice.</p>
                                </div>
                                <div className="slide1">
                                    <input type="checkbox" value={audio.voiceTypeCloned} id="slide1" name="check" checked={audio.voiceTypeCloned} onClick={() => audio.setVoiceTypeCloned(!audio.voiceTypeCloned)} />
                                    <label htmlFor="slide1"></label>
                                </div>
                            </div>
                            {
                                !audio.voiceTypeCloned ?
                                    <div className="autoplay-box">
                                        <div className="autoplay-caption">
                                            <h5 className="autoplayP">AI Voice List</h5>
                                            <p className="autoplayPP">Select AI voice from list</p>
                                        </div>
                                        <div>
                                            <select className="select1" name="defaultvoice" id="defaultvoice" onChange={handleDefaultSelect}>
                                                {
                                                    langVoiceList.map((item) => (
                                                        <option selected={item.id === audio.selectedVoice} key={item.id} value={item.id} className="option1">{item.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div> : null
                            }
                            {
                                audio.voiceTypeCloned && audio.clonedVoice.length ?
                                    <div className="autoplay-box">
                                        <div className="autoplay-caption">
                                            <h5 className="autoplayP">Cloned Voice List</h5>
                                            <p className="autoplayPP">Select the cloned voice</p>
                                        </div>
                                        <div>
                                            <select className="select1" name="clonedVoice" id="clonedVoice">
                                                <option value="en" className="option1">English</option>
                                                <option value="sp" className="option3">Spanish</option>
                                                <option value="fr" className="option2">French</option>
                                                <option value="hi" className="option2">Hindi</option>
                                            </select>
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                            {audio.voiceTypeCloned && !audio.clonedVoiceList.length ?
                                <>
                                    <div className="autoplay-box">
                                        <div className="autoplay-caption">
                                            <h5 className="autoplayP">Clone your voice..</h5>
                                            <p className="autoplayPP">Add a MP3 file of your voice to clone</p>
                                        </div>
                                        <div className="select">
                                            <input id="select2" type="file" required onChange={handleFileChange} />
                                            <label htmlFor="select2"></label>

                                        </div>
                                    </div>
                                    <div className="autoplay-box">
                                        <div className="autoplay-caption">
                                            <p className="autoplayPP">Give a name to your voice</p>
                                        </div>
                                        <div className="select">
                                            <input id="select2" type="text" value={audio.clonedVoiceName} required onChange={handleInputChange} />
                                            <label htmlFor="select2"></label>
                                        </div>
                                    </div>
                                </> : null}
                            {audio.voiceTypeCloned && audio.clonedVoiceList.length ?
                                <>
                                    <div className="autoplay-box">
                                        <div className="autoplay-caption">
                                            <h5 className="autoplayP">Cloned Voice List</h5>
                                            <p className="autoplayPP">Select cloned voice</p>
                                        </div>
                                        <div>
                                            <select className="select1" name="defaultvoice" id="defaultvoice" onChange={handleDefaultSelect}>
                                                <option selected disabled></option>
                                                {
                                                    audio.clonedVoiceList.map((item) => (
                                                        <option selected={item.id === audio.selectedVoice} key={item.id} value={item.id} className="option1">{item.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </> : null}

                        </div>
                    </div>
                    <br />
                    <div className="btns-box">
                        {
                            (audio.voiceTypeCloned && !audio.clonedVoiceList.length) ?
                                <button className="btn-save">Upload</button> :
                                <button className="btn-save">Save</button>
                        }

                    </div>
                    <div className="saved-box">
                        <p className="savedP">Saved!</p>
                    </div>
                </div>
            </form>
            {
                (audio.voiceTypeCloned && audio.clonedVoiceList.length) ?
                    <button className="btn-cancel" onClick={handleClickDelete}>Delete Cloned Voice?</button> : null
            }
            <br />
        </>
    )
}

export default Settings