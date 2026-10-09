/* src/core/components/layout/Message.tsx */
import { Card, TextArea } from '../ui'

type Props = { message: string; setMessage: (m: string) => void }

export function Message({ message, setMessage }: Props) {
  return (
    <Card title="Message">
      <TextArea value={message} onChange={setMessage} placeholder="Write your letter..." rows={6} />
    </Card>
  )
}