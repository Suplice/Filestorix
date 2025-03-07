import ModalWrapper from "../FileSection/ModalWrapper";
import LoadingSpinner from "./loadingSpinner";

const modalLoadingSpinner = () => {
  return (
    <ModalWrapper>
      <LoadingSpinner />
    </ModalWrapper>
  );
};

export default modalLoadingSpinner;
