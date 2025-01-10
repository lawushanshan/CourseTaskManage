'use client'

import { Button, Typography, Row, Col, Card, Space } from 'antd'
import {
  RocketOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import Image from 'next/image'

const { Title, Paragraph } = Typography

export function HomeContainer() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <Row align="middle" justify="center">
            <Col xs={24} lg={12} className="hero-text">
              <Title>
                在线教育新体验
              </Title>
              <Paragraph className="hero-description">
                EduFlow 为您提供专业的在线学习平台，随时随地开启您的学习之旅
              </Paragraph>
              <Space size="middle">
                <Link href="/register">
                  <Button type="primary" size="large">
                    立即开始
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="large">
                    浏览课程
                  </Button>
                </Link>
              </Space>
            </Col>
            <Col xs={24} lg={12} className="hero-image">
              <Image
                src="/images/hero-illustration.svg"
                alt="EduFlow Learning"
                width={600}
                height={400}
                priority
                className="hero-image"
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <Row gutter={[32, 32]} justify="center">
          <Col span={24} className="text-center">
            <Title level={2}>为什么选择 EduFlow</Title>
            <Paragraph className="section-description">
              专业的在线教育解决方案，助力您的学习成长
            </Paragraph>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="feature-card">
              <RocketOutlined className="feature-icon" />
              <Title level={4}>快速上手</Title>
              <Paragraph>简单直观的界面设计，让您快速开始学习之旅</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="feature-card">
              <BookOutlined className="feature-icon" />
              <Title level={4}>丰富课程</Title>
              <Paragraph>涵盖多个领域的优质课程，满足您的学习需求</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="feature-card">
              <TeamOutlined className="feature-icon" />
              <Title level={4}>互动学习</Title>
              <Paragraph>与老师和同学实时互动，提升学习效果</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="feature-card">
              <UserOutlined className="feature-icon" />
              <Title level={4}>个性化学习</Title>
              <Paragraph>根据您的学习进度和兴趣推荐合适的课程</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <Row justify="center" align="middle">
          <Col xs={24} md={16} lg={12} className="text-center">
            <Title level={2}>准备好开始学习了吗？</Title>
            <Paragraph className="cta-description">
              立即注册，开启您的学习之旅
            </Paragraph>
            <Link href="/register">
              <Button type="primary" size="large">
                免费注册
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  )
} 