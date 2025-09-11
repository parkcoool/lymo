import * as S from "./IconButton.styles";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function IconButton({ children, ...props }: IconButtonProps) {
  return <S.Wrapper {...props}>{children}</S.Wrapper>;
}
