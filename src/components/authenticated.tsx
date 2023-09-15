import { useTmwuCredentials } from "../hooks/use-tmwu-credentials";

type Props = {
  children: JSX.Element;
};

export default function Authenticated({ children }: Props) {
  const { isAuthenticated } = useTmwuCredentials();

  if (!isAuthenticated) return null;

  return children;
}
