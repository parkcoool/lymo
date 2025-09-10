import * as S from "./IconWrapper.styles";

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export default function IconWrapper(props: IconWrapperProps) {
  return <S.Wrapper {...props} />;
}
