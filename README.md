# subtitles-to-audio

Converts subtitle text to audio files by time mark.

[Yandex SpeechKit](https://cloud.yandex.com/en/services/speechkit) is used as a Text-To-Speech service.

Required environment variables:
- `SPEECH_KIT_IAM_TOKEN` — IAM token for SpeechKit
- `SPEECH_KIT_FOLDER_ID` — folder ID for SpeechKit

Other settings in [settings.js](./settings.js) file.

Usage:
```sh
node index.js ./path/to/subtitles.srt
```

Saves audio files to the same directory where the input subtitle file is located.
