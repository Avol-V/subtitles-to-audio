export type SpeechVoice =
	| 'oksana' // F, RU
	| 'jane' // F, RU
	| 'omazh' // F, RU
	| 'zahar' // M, RU
	| 'ermil' // M, RU
	| 'alyss' // F, EN
	| 'nick' // M, EN
;

export type SpeechEmotion =
	| 'good'
	| 'evil'
	| 'neutral'
;

export type SpeechLanguage =
	| 'ru-RU'
	| 'en-US'
;

export type SpeechKitOptions = {
	iamToken: string,
	folderId: string,
	text?: string,
	ssml?: string,
	lang?: SpeechLanguage,
	voice?: SpeechVoice,
	emotion?: SpeechEmotion,
	speed?: number,
	format?: 'lpcm' | 'oggopus',
	sampleRateHertz?: 48000 | 16000 | 8000,
	timeout?: number,
	retries?: number,
};
