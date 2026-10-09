import { Card, Button } from '../ui'
import { PATTERN_LIST, type PatternId } from '../../../letter/patterns'

type Props = {
  selected: PatternId
  onSelect: (id: PatternId) => void
}

export function Pattern({ selected, onSelect }: Props) {
  return (
    <Card title="Pattern">
      <div className="flex flex-wrap gap-3 justify-center">
        {PATTERN_LIST.map((p) => (
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