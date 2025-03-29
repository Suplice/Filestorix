import { Section } from "@/lib/utils/utils";
import MainEmptyList from "./MainEmptyList";
import FavoriteEmptyList from "./FavoriteEmptyList";
import TrashEmptyList from "./TrashEmptyList";

interface EmptyListProps {
  section: Section;
}

const EmptyList: React.FC<EmptyListProps> = ({ section }) => {
  switch (section) {
    case Section.Trash:
      return <TrashEmptyList />;
    case Section.Favorite:
      return <FavoriteEmptyList />;
    default:
      return <MainEmptyList />;
  }
};

export default EmptyList;
