import React from "react";
import { Modal } from "react-bootstrap/";

function MainModal({ modalStatus = false, setModalStatus, modalControl }) {
  return (
    <>
      <Modal show={modalStatus} onHide={() => setModalStatus(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalControl.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalControl.children}</Modal.Body>
      </Modal>
    </>
  );
}

export default MainModal;
