import { FcGoogle } from "react-icons/fc";
import { Button } from "../../ui/button";
import { FaGithub } from "react-icons/fa";

const handleGoogleLogin = () => {
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/callback/google&response_type=code&scope=email%20profile&access_type=offline`;
};

const handleGithubLogin = () => {
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/callback/github&scope=user:email`;
};

const OAuth = () => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-white transition-all"
        onClick={handleGoogleLogin}
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-white transition-all"
        onClick={handleGithubLogin}
      >
        <FaGithub className="text-xl" />
        Continue with GitHub
      </Button>
    </div>
  );
};

export default OAuth;
