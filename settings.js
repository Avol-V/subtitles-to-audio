/**
 * @typedef { import( './lib/speech-kit.types.js' ).SpeechKitOptions } SpeechKitOptions
 * @typedef { import( './lib/process-with-ffmpeg.types.js' ).FfmpegOptions } FfmpegOptions
 */

/** @type { Partial<SpeechKitOptions> } */
export const speechKitOptions = {
	lang: 'ru-RU',
	voice: 'oksana',
	emotion: 'neutral',
	speed: 1,
	format: 'oggopus',
	timeout: 5 * 60_000,
	retries: 3,
};

/** @type { Partial<FfmpegOptions> } */
export const processingOptions = {
	audioTempo: 2,
};
