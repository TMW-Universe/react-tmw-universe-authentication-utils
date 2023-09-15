import { useTmwuCredentials } from "../hooks/use-tmwu-credentials";

type Props = {
  children: JSX.Element;
};

export default function NotAuthenticated({ children }: Props) {
  const { isAuthenticated } = useTmwuCredentials();

  if (isAuthenticated) return null;

  return children;
}
