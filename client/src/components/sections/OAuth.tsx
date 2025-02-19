import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";

const OAuth = () => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-white transition-all"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-white transition-all"
      >
        <FaGithub className="text-xl" />
        Continue with GitHub
      </Button>
    </div>
  );
};

export default OAuth;
