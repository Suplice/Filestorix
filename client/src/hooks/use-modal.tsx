"use client";
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

  /**
   * Closes the currently open modal.
   */
  const hideModal = () => {
    dispatch(closeModal());
  };

  /**
   * Opens a modal of a specified type with optional properties.
   *
   * @param type - The type of modal to open (defined in ModalType enum).
   * @param props - Additional properties or data to pass to the modal (optional).
   */
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
