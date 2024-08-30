import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const scrollAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
`;

// 定义样式组件
const Container = styled.div`
  text-align: center;
  max-width: 1200px;
  margin: auto;
`;

const Title = styled.h1`
  margin-top: -100px;
`;

const Description = styled.p``;

const BoxesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 100px;
`;

const Box = styled.img`
  width: 50px;
  height: 50px;
`;

const Funnel = styled.img`
  margin-top: 10px;
  width: 100px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  animation: ${rotateAnimation} 10s linear infinite;
`;

const LogosContainer = styled.div`
  margin-top: 10px;
  display: flex;
  white-space: nowrap; // 保证所有图标在一行显示
  overflow: hidden;
  height: 50px;
`;

const Logo = styled.img`
  margin-top: 10px;
  min-width: 50px;
  height: 50px;
  flex: 0 0 auto; // 确保不压缩图标
  margin-right: 10px;  // 在logo之间增加间隔
  animation: ${scrollAnimation} 5s linear infinite;
`;
const logos = [
    { src: "/apple.png", alt: "Company Logo 1" },
    { src: "/amazon.png", alt: "Company Logo 2" },
    { src: "/adobe.png", alt: "Company Logo 3" },
    { src: "/google.png", alt: "Company Logo 4" },
    { src: "/IBM.png", alt: "Company Logo 5" },
    { src: "/Microsoft.png", alt: "Company Logo 6" },
    { src: "/nvidia.png", alt: "Company Logo 7" },
    { src: "/tesla.png", alt: "Company Logo 8" },
    { src: "/HSBC.png", alt: "Company Logo 9" },
    // 添加更多logo
  ];
// React component
const ReferralPage = () => {
  return (
    <Container>
      <Title>Invite friends. Get up to $100 for every referral!</Title>
      <Description>Sign In Today</Description>
      <BoxesContainer>
        {/* Box components can be added here */}
      </BoxesContainer>
      <Funnel src="/ourLogo.png" alt="Funnel" />
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
