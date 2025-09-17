import { useState } from "react";
import { MdAdd, MdMusicNote, MdPerson } from "react-icons/md";

import useFetchingSongStore from "~/contexts/useFetchingSongStore";

import Modal from "../Modal";

import * as S from "./AddSongModal.styles";

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSongModal({ isOpen, onClose }: AddSongModalProps) {
  const setFetchingSong = useFetchingSongStore(
    (state) => state.setFetchingSong
  );

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFetchingSong({
      fetchType: "add",
      title,
      artist,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <S.Wrapper onSubmit={handleSubmit}>
        <S.InputWrapper>
          <S.Label htmlFor="title-input">
            <S.LabelIconWrapper>
              <MdMusicNote />
            </S.LabelIconWrapper>
            음악 이름
          </S.Label>
          <S.Input
            id="title-input"
            placeholder="음악 이름"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </S.InputWrapper>

        <S.InputWrapper>
          <S.Label htmlFor="artist-input">
            <S.LabelIconWrapper>
              <MdPerson />
            </S.LabelIconWrapper>
            아티스트명
          </S.Label>
          <S.Input
            id="artist-input"
            placeholder="아티스트명"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
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
