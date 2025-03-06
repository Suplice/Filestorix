import {
  closeModal,
  ModalProps,
  ModalType,
  openModal,
} from "@/store/modalSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export const useModal = () => {
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const modalProps = useSelector((state: RootState) => state.modal.modalProps);
  const dispatch = useDispatch();

  const hideModal = () => {
    dispatch(closeModal());
  };

  const showModal = (type: ModalType, props: ModalProps) => {
    dispatch(openModal({ type, props }));
  };

  return {
    isOpen,
    hideModal,
    showModal,
    modalType,
    modalProps,
  };
};
