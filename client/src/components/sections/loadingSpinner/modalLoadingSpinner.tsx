import ModalPortal from "../FileSection/ModalPortal";
import LoadingSpinner from "./loadingSpinner";

const modalLoadingSpinner = () => {
  return (
    <ModalPortal>
      <LoadingSpinner />
    </ModalPortal>
  );
};

export default modalLoadingSpinner;
