interface GithubAuthCallbackLayoutProps {
  children: React.ReactNode;
}

const GithubAuthCallback: React.FC<GithubAuthCallbackLayoutProps> = ({
  children,
}) => {
  return <div>{children}</div>;
};

export default GithubAuthCallback;
