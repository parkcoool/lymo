import * as S from "./Skeleton.styles";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Skeleton({ ...props }: SkeletonProps) {
  return <S.Wrapper {...props} />;
}
