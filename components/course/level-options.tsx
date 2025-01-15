import { Level } from '@prisma/client'

const LEVEL_LABELS = {
  [Level.BEGINNER]: '入门',
  [Level.INTERMEDIATE]: '进阶',
  [Level.ADVANCED]: '高级',
}

export function LevelOptions() {
  return Object.entries(LEVEL_LABELS).map(([value, label]) => (
    <Select.Option key={value} value={value}>
      {label}
    </Select.Option>
  ))
} 