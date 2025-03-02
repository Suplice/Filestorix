import LoadingSpinner from "@/components/sections/loadingSpinner/loadingSpinner";
import { Suspense } from "react";

interface GithubAuthCallbackLayoutProps {
  children: React.ReactNode;
}

const GithubAuthCallback: React.FC<GithubAuthCallbackLayoutProps> = ({
  children,
}) => {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </div>
  );
};

export default GithubAuthCallback;
