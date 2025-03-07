import ModalPortal from "../ModalPortal";
import CatalogUploader from "./CatalogUploader";

const CatalogUploaderWrapper = () => {
  return (
    <ModalPortal>
      <CatalogUploader />
    </ModalPortal>
  );
};

export default CatalogUploaderWrapper;
