import { PageContainer } from '@/components/layouts/page-container'
import { Button, Row, Col, Card, Statistic } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function DashboardPage() {
  return (
    <PageContainer
      title="仪表板"
      subtitle="欢迎回来，这里是您的学习概览"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          新建课程
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="总课程数" value={12} />
          </Card>
        </Col>
        {/* 更多统计卡片 */}
      </Row>
      {/* 其他内容 */}
    </PageContainer>
  )
} 