import React, { useRef, useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';
import { validateURL } from '../utils/Validation';

function EditAvatarPopup(props) {

  const { isOpen, onClose, onUpdateAvatar, download, renderDownload, inputError, setInputError } = props;
  const avatarRef = useRef(null);
  const [link, setLink] = useState('');

  function handleLink(evt) {
    const { value } = evt.target;
    setLink(value);
    setInputError(validateURL(value));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    renderDownload();
    onUpdateAvatar(avatarRef.current.value);
  }

  useEffect(() => {
    if (isOpen) {
      avatarRef.current.value = '';
    };
    setLink('');
    setInputError('');
  }, [isOpen]);

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="avatar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Сохранить"
      download={download}
      downloadText="Обновление..."
      disabled={!!inputError || !link}
      children={
        <div className="popup__form">
          <input
            type="url"
            className="popup__input popup__input_type_avatar"
            id="urlav"
            name="url"
            placeholder="Ссылка на картинку"
            value={link}
            onChange={handleLink}
            required=""
            ref={avatarRef} />
          <span className={`popup__error urlav-error ${inputError && 'popup__error_active'}`}>{inputError}</span>
        </div>
      }
    />
  )
}

export default EditAvatarPopup;

