interface SignupLayoutProps {
  children: React.ReactNode;
}

const SignupLayout: React.FC<SignupLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 text-white p-8 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default SignupLayout;
