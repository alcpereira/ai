import { adk } from '@react-native-ai/adk'
import { useMemo } from 'react'

import { float32ArrayToWAV } from '../../utils/androidAudioUtils'
import {
  RecordButtonUIBase,
  type RecordButtonUIBaseProps,
} from './RecordButtonUIBase'

export type RecordButtonProps = Omit<
  RecordButtonUIBaseProps,
  'transcriptionModel' | 'float32ArrayToWAV'
>

export function RecordButton(props: RecordButtonProps) {
  const transcriptionModel = useMemo(() => adk.transcriptionModel(), [])

  return (
    <RecordButtonUIBase
      transcriptionModel={transcriptionModel}
      float32ArrayToWAV={float32ArrayToWAV}
      {...props}
    />
  )
}
