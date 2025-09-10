import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 120px 0;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${(props) => props.theme.colors.background};
`;
