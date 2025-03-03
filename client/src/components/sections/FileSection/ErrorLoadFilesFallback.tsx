"use client";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/lib/utils/ApiResponses";

interface ErrorLoadFilesFallback {
  reset: () => void;
}

const ErrorLoadFilesFallback: React.FC<ErrorLoadFilesFallback> = ({
  reset,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-6">
      <p>{ErrorMessage.FAILED_FETCH_FILES}</p>
      <Button onClick={reset}>Try again.</Button>
    </div>
  );
};

export default ErrorLoadFilesFallback;
