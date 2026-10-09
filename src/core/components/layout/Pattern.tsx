import { Card, Button } from '../ui'
import { PATTERN_LIST, type PatternId } from '../../../letter/patterns'

type PatternProps = {
  selected: PatternId
  onSelect: (id: PatternId) => void
}

export function Pattern({ selected, onSelect }: PatternProps) {
  return (
    <Card title="Pattern">
      <div className="flex flex-wrap gap-3 justify-center">
        {PATTERN_LIST.map((patternOption) => (
          <Button
            key={patternOption.id}
            onClick={() => onSelect(patternOption.id)}
            variant={selected === patternOption.id ? 'primary' : 'outline'}
            size="lg"
          >
            {patternOption.name}
          </Button>
        ))}
      </div>
    </Card>
  )
}