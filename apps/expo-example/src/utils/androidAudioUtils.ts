/**
 * Converts Float32Array PCM data to a 16-bit PCM WAV file
 *
 * Mirrors `float32ArrayToWAV` from `appleAudioUtils`, without depending on
 * `@react-native-ai/apple`, whose native modules only exist on iOS.
 */
export const float32ArrayToWAV = (
  pcmData: Float32Array,
  sampleRate: number
): ArrayBuffer => {
  const dataSize = pcmData.length * 2
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  const writeString = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index++) {
      view.setUint8(offset + index, value.charCodeAt(index))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)

  for (let index = 0; index < pcmData.length; index++) {
    const sample = Math.max(-1, Math.min(1, pcmData[index]))
    view.setInt16(44 + index * 2, sample * 0x7fff, true)
  }

  return buffer
}
