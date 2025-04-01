import { cn } from "@/lib/utils/utils";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface ScrollBackUpProps {
  onClick: () => void;
  bottom?: number;
}

const ScrollBackUp: React.FC<ScrollBackUpProps> = ({
  onClick,
  bottom = 10,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center absolute left-0 p-0 w-full  gap-0",
        `bottom-${bottom}`
      )}
    >
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
