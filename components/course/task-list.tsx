'use client'

import { Task } from '@/types'
import { useState } from 'react'
import { Collapse, Button } from 'antd'
import { StepList } from './step-list'

const { Panel } = Collapse

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <Collapse>
      {tasks.map((task) => (
        <Panel 
          key={task.id} 
          header={task.title}
          extra={<span className="text-sm text-gray-500">{task.steps.length} 个步骤</span>}
        >
          <div className="py-2">
            <p className="text-gray-600 mb-4">{task.description}</p>
            <StepList steps={task.steps} />
          </div>
        </Panel>
      ))}
    </Collapse>
  )
} 