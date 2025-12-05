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

  // Tę funkcję podpinasz pod prop `onScroll` w ScrollView
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > offset);
  };

  return {
    scrollRef, // Podepnij to pod ref ScrollView
    isScrolled,
    scrollBackUp,
    handleScroll, // Podepnij to pod onScroll={handleScroll} i ustaw scrollEventThrottle={16}
  };
};

export default useScrollPosition;
