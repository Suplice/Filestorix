interface GoogleAuthCallbackLayoutProps {
  children: React.ReactNode;
}

const GoogleAuthCallback: React.FC<GoogleAuthCallbackLayoutProps> = ({
  children,
}) => {
  return <div>{children}</div>;
};

export default GoogleAuthCallback;
