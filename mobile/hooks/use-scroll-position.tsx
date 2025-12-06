import { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from "react-native";

const useScrollPosition = (offset: number = 50) => {
  const scrollRef = useRef<ScrollView>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollBackUp = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > offset);
  };

  return {
    scrollRef,
    isScrolled,
    scrollBackUp,
    handleScroll,
  };
};

export default useScrollPosition;
