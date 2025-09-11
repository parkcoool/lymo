import styled, { keyframes } from "styled-components";

const skeletonLoading = keyframes`
  0% {
    background-position: -100%;
  }

  100% {
    background-position: 100%;
  }
`;

export const Wrapper = styled.div`
  animation: ${skeletonLoading} 1.5s infinite linear;
  background: linear-gradient(90deg, #c6c6c6 25%, #f5f5f5 50%, #c6c6c6 75%);
  background-size: 200% 100%;
`;
