import styled from "styled-components";

import IconWrapper from "~/components/IconWrapper";

export const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 80px;
  flex-direction: column;
  align-items: flex-start;
`;

export const HeroSection = styled.section`
  display: flex;
  height: 80vh;
  padding-top: 20vh;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  gap: 40px;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  opacity: 0.8;
  color: ${(props) => props.theme.colors.onBackground};
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const LogoIconWrapper = styled(IconWrapper)`
  width: 40px;
  height: 40px;
  color: ${(props) => props.theme.colors.onBackground};
`;

export const SearchBox = styled.button`
  display: flex;
  width: 80%;
  padding: 0 15px;
  height: 50px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  border-radius: 32px;
  background: ${(props) => props.theme.colors.surface};
  border: none;
  cursor: pointer;
  white-space: nowrap;
`;

export const Section = styled.section`
  display: flex;
  padding: 10px 0;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

export const SectionTitle = styled.h2`
  display: flex;
  padding: 0 20px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  color: ${(props) => props.theme.colors.onBackground};
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  opacity: 0.8;
`;

export const SectionIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
`;

export const SectionContent = styled.div`
  display: flex;
  padding: 20px;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  overflow-x: auto;
`;
