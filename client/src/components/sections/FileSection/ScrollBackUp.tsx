import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface ScrollBackUpProps {
  onClick: () => void;
}

const ScrollBackUp: React.FC<ScrollBackUpProps> = ({ onClick }) => {
  return (
    <div className="flex items-center justify-center absolute bottom-10 p-0 w-auto gap-0">
      <motion.div
        onClick={onClick}
        className="rounded-full bg-black items-center justify-center px-2 py-2 flex cursor-pointer"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <ArrowUp />
      </motion.div>
    </div>
  );
};

export default ScrollBackUp;
