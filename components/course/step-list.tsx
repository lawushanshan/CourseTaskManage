'use client'

import { Step } from '@/types'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useToast } from '../ui/use-toast'

interface StepListProps {
  steps: Step[]
}

export function StepList({ steps }: StepListProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const { toast } = useToast()

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
      toast({
        title: '步骤完成',
        description: '恭喜你完成了这个步骤！',
      })
    } catch (error) {
      toast({
        title: '出错了',
        description: error instanceof Error ? error.message : '无法完成步骤',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.id} className="flex items-start gap-4">
          <div className="flex-1">
            <h4 className="font-medium">{step.title}</h4>
            <div className="mt-2 prose prose-sm max-w-none">
              {step.contentType === 'MARKDOWN' ? (
                <div dangerouslySetInnerHTML={{ __html: step.content }} />
              ) : (
                <p>{step.content}</p>
              )}
            </div>
            {step.resources.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-medium">相关资源：</h5>
                <ul className="mt-1 space-y-1">
                  {step.resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        资源 {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button
            variant={completedSteps.has(step.id) ? 'secondary' : 'default'}
            size="sm"
            onClick={() => handleCompleteStep(step.id)}
            disabled={completedSteps.has(step.id)}
          >
            {completedSteps.has(step.id) ? '已完成' : '完成'}
          </Button>
        </div>
      ))}
    </div>
  )
} 