/* src/core/components/layout/LetterType.tsx */
import { Card, Button } from '../ui'

type Option = { id: string; name: string }

type Props = {
  options: Option[]
  selected: string
  onSelect: (id: string) => void
}

export function LetterType({ options, selected, onSelect }: Props) {
  return (
    <Card title="Letter Type">
      <div className="flex flex-wrap gap-3">
        {options.map((p) => (
          <Button
            key={p.id}
            onClick={() => onSelect(p.id)}
            variant={selected === p.id ? 'primary' : 'outline'}
            size="lg"
          >
            {p.name}
          </Button>
        ))}
      </div>
    </Card>
  )
}