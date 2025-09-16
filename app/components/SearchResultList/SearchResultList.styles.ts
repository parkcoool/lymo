import { motion } from "motion/react";
import styled from "styled-components";

import AddSongDialog from "../AddSongDialog";

export const StyledNormalDialog = styled(AddSongDialog)<{ $long: boolean }>`
  ${({ $long }) => $long && `padding-bottom: 100px;`}
`;

export const NormalDialogWrapper = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const ExtendedDialogWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
