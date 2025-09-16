import { MdAdd, MdMusicNote, MdPerson } from "react-icons/md";

import Modal from "../Modal";

import * as S from "./AddSongModal.styles";

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSongModal({ isOpen, onClose }: AddSongModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <S.Wrapper>
        <S.InputWrapper>
          <S.Label htmlFor="title-input">
            <S.LabelIconWrapper>
              <MdMusicNote />
            </S.LabelIconWrapper>
            음악 이름
          </S.Label>
          <S.Input id="title-input" placeholder="음악 이름" autoFocus />
        </S.InputWrapper>

        <S.InputWrapper>
          <S.Label htmlFor="artist-input">
            <S.LabelIconWrapper>
              <MdPerson />
            </S.LabelIconWrapper>
            아티스트명
          </S.Label>
          <S.Input id="artist-input" placeholder="아티스트명" />
        </S.InputWrapper>

        <S.Footer>
          <S.Description>
            정확한 음악 이름과 아티스트명을 입력하지 않으면 노래를 못 찾을 수
            있어요.
          </S.Description>
          <S.Button>
            <S.ButtonIconWrapper>
              <MdAdd />
            </S.ButtonIconWrapper>
            음악 등록하기
          </S.Button>
        </S.Footer>
      </S.Wrapper>
    </Modal>
  );
}
