'use client'

import { Task } from '@/types'
import { useState } from 'react'
import { Button } from '../ui/button'
import { StepList } from './step-list'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)

  return (
    <div className="space-y-4 py-4">
      {tasks.map((task) => (
        <div key={task.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedTaskId(
                expandedTaskId === task.id ? null : task.id
              )}
            >
              {expandedTaskId === task.id ? '收起' : '展开'}
            </Button>
          </div>
          {expandedTaskId === task.id && (
            <div className="mt-4 border-t pt-4">
              <StepList steps={task.steps} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 