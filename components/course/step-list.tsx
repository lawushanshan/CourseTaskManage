'use client'

import { Step } from '@/types'
import { List, Button, message } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useState } from 'react'

interface StepListProps {
  steps: Step[]
}

export function StepList({ steps }: StepListProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const handleCompleteStep = async (stepId: string) => {
    try {
      const response = await fetch(`/api/steps/${stepId}/complete`, {
        method: 'POST',
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setCompletedSteps(new Set([...completedSteps, stepId]))
      message.success('步骤完成！')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '无法完成步骤')
    }
  }

  return (
    <List
      dataSource={steps}
      renderItem={(step) => (
        <List.Item
          actions={[
            <Button
              key="complete"
              type={completedSteps.has(step.id) ? 'primary' : 'default'}
              icon={<CheckOutlined />}
              onClick={() => handleCompleteStep(step.id)}
              disabled={completedSteps.has(step.id)}
            >
              {completedSteps.has(step.id) ? '已完成' : '完成'}
            </Button>
          ]}
        >
          <List.Item.Meta
            title={step.title}
            description={step.content}
          />
        </List.Item>
      )}
    />
  )
} 