import axios from 'axios';
import { languages } from '../Context/message';

export const cloneMyVoice = async (audioFile, file, gender) => {
    const data = await axios.post('http://localhost:5000/upload_voice', { audioFile, file, gender })
    return data?.data;
}

export const playHtApiCall2 = async (text = 'Welcome to Audiobook 2.0', selectedVoiceId, lang = "English") => {
    const mainLang = lang.toLocaleLowerCase();
    console.log(mainLang);
    const data = await axios.post('http://localhost:5000/text-to-speech', { text, selectedVoiceId, mainLang });
    console.log(data.data);
    return data?.data;
}

export const playHtApiCall = async (text = 'Welcome to Audiobook 2.0', selectedVoiceId) => {
    const data = await axios.post('https://play.ht/api/transcribe', {
        userId: import.meta.env.VITE_APP_PLAYHT_API_KEY,
        ssml: `<speak><p>${text}</p></speak>`,
        voice: selectedVoiceId,
        globalSpeed: "100%",
        globalVolume: "+0dB",
        pronunciations: [],
        platform: "dashboard",
        articleDataId: "ad1ddf01-ac11-4ffd-88f6-74900bd88aa4"
    });
    console.log(data.data);
    return data?.data;
}

export const getAllVoice = async () => {
    const data = await axios.get('http://localhost:5000/ai-voices')
    return data?.data;
}
export const getAIClonedVoices = async () => {
    const data = await axios.get('http://localhost:5000/ai-cloned-voice')
    return data?.data;
}
export const deleteClonedVoice = async () => {
    const clonedIdCall = await getAIClonedVoices();
    if (clonedIdCall[0].id) {
        const data = await axios.post('http://localhost:5000/delete-ai-cloned-voice', { cloneId: clonedIdCall[0].id })
        return data?.data;
    }
    return;
}

export const callingTranslateApi = async (text, lang) => {
    const translatedlanguage = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${text}`)
    const allData = translatedlanguage?.data[0]?.map((item)=> item[0]).toString();
    return allData;
}