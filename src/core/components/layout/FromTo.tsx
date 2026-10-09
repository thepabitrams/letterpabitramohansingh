/* src/core/components/layout/FromTo.tsx */
import { Card, Input } from '../ui'

type FromToProps = {
  senderName: string
  setSenderName: (value: string) => void
  recipientName: string
  setRecipientName: (value: string) => void
}

export function FromTo({
  senderName,
  setSenderName,
  recipientName,
  setRecipientName,
}: FromToProps) {
  return (
    <Card title="From & To">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="From"
          value={senderName}
          onChange={setSenderName}
          placeholder="Your name"
        />
        <Input
          label="To"
          value={recipientName}
          onChange={setRecipientName}
          placeholder="Her name"
        />
      </div>
    </Card>
  )
}