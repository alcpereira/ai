# Transcription

Convert speech to text on device with ML Kit's [GenAI Speech Recognition API](https://developers.google.com/ml-kit/genai/speech-recognition/android).

## Overview

`adk.transcriptionModel()` returns an AI SDK transcription model backed by ML Kit GenAI speech recognition. Audio never leaves the device. The model works with the AI SDK's `transcribe` function.

> [!WARNING]
> ML Kit GenAI speech recognition is in alpha. Google may change it in ways that break this provider.

## Requirements

- **Physical Android device with AICore** - The API is not supported on emulators or on devices with an unlocked bootloader
- **Android 12 (API 31)+** - Required for `basic` mode
- **Pixel 10 or newer** - Required for `advanced` mode

## Usage

```typescript
import { adk } from '@react-native-ai/adk'
import { experimental_transcribe as transcribe } from 'ai'

const file = await fetch(
  'https://www.voiptroubleshooter.com/open_speech/american/OSR_us_000_0010_8k.wav'
)
const audio = await file.arrayBuffer()

const response = await transcribe({
  model: adk.transcriptionModel(),
  audio,
})

console.log(response.text)
console.log(response.durationInSeconds)
```

The `audio` parameter accepts an `ArrayBuffer`, a `Uint8Array` or a base64-encoded string. The audio can be in any format Android's media decoders support, such as WAV, MP3, AAC (M4A) or Ogg. The provider decodes and resamples it to the 16 kHz mono PCM that ML Kit expects.

> [!NOTE]
> ML Kit reads audio at real-time pace, so transcribing a 30-second clip takes about 30 seconds.

## Options

```typescript
const model = adk.transcriptionModel({
  language: 'fr-FR',
  mode: 'advanced',
})
```

| Option     | Type                    | Description                                                                                                                                |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `language` | `string`                | BCP 47 locale, such as `en-US`. Defaults to the device locale                                                                              |
| `mode`     | `'basic' \| 'advanced'` | `basic` (default) uses a traditional on-device model. `advanced` prefers the GenAI model, which covers more languages and is more accurate |

`basic` mode supports `en-US`, with beta support for `fr-FR`, `it-IT`, `de-DE`, `es-ES`, `hi-IN`, `ja-JP`, `pt-BR`, `tr-TR`, `pl-PL`, `cmn-Hans-CN`, `ko-KR`, `cmn-Hant-TW`, `ru-RU` and `vi-VN`. See [the ML Kit docs](https://developers.google.com/ml-kit/genai/speech-recognition/android) for the `advanced` mode locales.

## Availability

Check whether the locale and mode can be used on the device:

```typescript
const model = adk.transcriptionModel({ language: 'en-US' })

const availability = await model.getAvailability()
// 'available' | 'downloadable' | 'downloading' | 'unavailable' | 'unknown'

const canTranscribe = await model.isAvailable() // available or downloadable
```

On iOS and web, `getAvailability()` resolves to `unavailable`.

## Preparing the Model

ML Kit may need to download the speech recognition model first. The provider downloads it on the first transcription. To download it ahead of time and show progress, call `prepare()`:

```typescript
const model = adk.transcriptionModel({ language: 'en-US' })

await model.prepare({
  onProgress: ({ phase, bytesDownloaded, bytesToDownload }) => {
    console.log(phase, bytesDownloaded, bytesToDownload)
  },
})
```

If the model is already on the device, `prepare()` resolves without downloading anything.

## Errors

Errors have a `code` from `AdkErrorCodes` (see [Getting Started - Errors](./getting-started.mdx#errors)):

| Code                | Meaning                                                      |
| ------------------- | ------------------------------------------------------------ |
| `MODEL_UNAVAILABLE` | The locale or mode is not supported on this device           |
| `MODEL_DOWNLOADING` | The system is still downloading the speech recognition model |
| `DOWNLOAD_FAILED`   | The speech recognition model download failed                 |
| `INVALID_MESSAGE`   | The audio could not be decoded                               |
| `RATE_LIMITED`      | AICore is busy or the app's quota ran out                    |

## Limitations

- **No timestamps** - ML Kit does not report word or segment timing, so `segments` is always empty
- **No streaming** - The provider implements `transcribe` only. Live microphone transcription is not exposed yet
- **Real-time processing** - Transcription takes as long as the audio
