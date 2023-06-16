import React, { useContext, useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { validateInput } from '../utils/Validation';

function EditProfilePopup(props) {

  const { isOpen, onClose, download, renderDownload, inputError, setInputError, sameInputError, setSameInputError } = props;
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser.name);
  const [about, setAbout] = useState(currentUser.about);

  function handleName(evt) {
    const { value } = evt.target;
    setName(value);
    setInputError(validateInput(value));
  }

  function handleAbout(evt) {
    const { value } = evt.target;
    setAbout(value);
    setSameInputError(validateInput(value));
  }

  useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
    setInputError('');
    setSameInputError('');
  }, [currentUser, isOpen])

  function handleSubmit(evt) {
    evt.preventDefault();
    renderDownload();
    props.onUpdateUser({
      name,
      about
    });
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="edit-profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Сохранить"
      download={download}
      downloadText="Сохранение..."
      disabled={!!inputError || !!sameInputError || !name || !about}
      children={
        <div className="popup__form">
          <input
            type="text"
            className="popup__input popup__input_type_name"
            id="profile-name"
            name="name"
            required
            minLength="2"
            maxLength="40"
            placeholder="Имя"
            value={name}
            onChange={handleName} />
          <span className={`popup__error name-error ${inputError && 'popup__error_active'}`}>{inputError}</span>
          <input
            type="text"
            className="popup__input popup__input_type_about"
            id="profile-about"
            name="about"
            required
            minLength="2"
            maxLength="200"
            placeholder="О себе"
            value={about}
            onChange={handleAbout} />
          <span className={`popup__error about-error ${sameInputError && 'popup__error_active'}`}>{sameInputError}</span>
        </div>
      }
    />
  )
}

export default EditProfilePopup;