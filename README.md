# Text to speech (TTS) and voice clone with translations using Google translation and Playht API

## To run the project

- Run `npm install` in both client and server
- create .env in both client and server

### CLIENT .env
- VITE_APP_PLAYHT_API_KEY={`PLAY.HT_USER_ID`}

### SERVER .env
- API_KEY={`PLAY.HT_SECRET_ACCESS_KEY`}
- USER_ID={`PLAY.HT_USER_ID`}

### Run project
- `npm run dev` (client)
- `npm start` (server)

### AI API

- Text to speech API (PlayHT) - https://docs.play.ht/reference/api-getting-started
- Translation API (Google)- https://translate.googleapis.com
