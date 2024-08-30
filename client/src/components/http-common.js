import React from 'react';
import styled, { keyframes } from 'styled-components';

// 定义滚动动画
const scrollAnimation = keyframes`
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

// 样式定义
const Container = styled.div`
  text-align: center;
  max-width: 1200px;
  margin: auto;
`;

const LogosContainer = styled.div`
  margin-top: 30px;
  display: flex;
  white-space: nowrap; // 防止内容换行
  overflow: hidden;
  height: 50px;  // 根据logo的高度调整
`;

const Logo = styled.img`
  min-width: 50px;  // 根据logo的实际大小调整
  height: 50px;
  flex: 0 0 auto;  // 防止flex布局压缩图标
  margin-right: 10px;  // 在logo之间增加间隔
  animation: ${scrollAnimation} 20s linear infinite;
`;

// 用于展示不同logo的数组
const logos = [
  { src: "/logo1.png", alt: "Company Logo 1" },
  { src: "/logo2.png", alt: "Company Logo 2" },
  { src: "/logo3.png", alt: "Company Logo 3" },
  // 添加更多logo
];

// React组件定义
const ReferralPage = () => {
  return (
    <Container>
      <LogosContainer>
        {logos.map((logo, index) => (
          <Logo key={index} src={logo.src} alt={logo.alt} />
        ))}
        {/* 重复整个数组以确保无缝滚动 */}
        {logos.map((logo, index) => (
          <Logo key={`second-set-${index}`} src={logo.src} alt={logo.alt} />
        ))}
      </LogosContainer>
    </Container>
  );
};

export default ReferralPage;
