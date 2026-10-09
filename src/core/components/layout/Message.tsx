/* src/core/components/layout/Message.tsx */
import { Card, TextArea } from '../ui'

type MessageProps = {
  message: string
  setMessage: (value: string) => void
}

export function Message({ message, setMessage }: MessageProps) {
  return (
    <Card title="Message">
      <TextArea
        value={message}
        onChange={setMessage}
        placeholder="Write your letter..."
        rows={6}
      />
    </Card>
  )
}