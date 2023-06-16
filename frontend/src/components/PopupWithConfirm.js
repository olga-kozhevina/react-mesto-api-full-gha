import React from "react";
import PopupWithForm from "./PopupWithForm";

function PopupWithConfirm(props) {
    const { isOpen, onClose, onCardDelete, download, renderDownload } = props;

    function handleSubmit(evt) {
        evt.preventDefault();
        renderDownload();
        onCardDelete();
    }

    return (
        <PopupWithForm
            name="confirm"
            title="Вы уверены?"
            buttonText="Да"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            download={download}
            downloadText="Удаление..."
        />
    );
}

export default PopupWithConfirm;