import LoadingSpinner from "@/components/sections/LoadingSpinner/LoadingSpinner";
import { Suspense } from "react";

interface GoogleAuthCallbackLayoutProps {
  children: React.ReactNode;
}

const GoogleAuthCallback: React.FC<GoogleAuthCallbackLayoutProps> = ({
  children,
}) => {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </div>
  );
};

export default GoogleAuthCallback;
