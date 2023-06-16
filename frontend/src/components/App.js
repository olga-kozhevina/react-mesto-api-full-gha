import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Main from './Main';
import Footer from './Footer';
import Error from './Error';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { initialUser } from '../utils/constants';
import api from '../utils/Api';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoToolTip from './InfoTooltip';
import PopupWithConfirm from './PopupWithConfirm';
import * as apiAuth from '../utils/apiAuth';

function App() {

  // переменная состояния ошибки
  const [errorMessage, setErrorMessage] = useState('');

  // переменные состояния видимости попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(false);

  const [download, setDownload] = useState(false);

  // переменные состояния открытия попапа карточки
  const [selectedCard, setSelectedCard] = useState({});

  // переменные состояния пользователя
  const [currentUser, setCurrentUser] = useState(initialUser);

  // переменные состояния карточек
  const [cards, setCards] = useState([]);

  // переменные состояния для отслеживания состояния аутентификации пользователя
  const [loggedIn, setLoggedIn] = useState(false);
  const [signedIn, setSignedIn] = useState(true);

  // переменные состояния ответа попапа после регистрации/логина 
  const [infoToolTipPopup, setInfoToolTipPopup] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");

  const navigate = useNavigate();

  // переменные для вывод ошибок валидации
  const [inputError, setInputError] = useState('');
  const [sameInputError, setSameInputError] = useState('');

  // получаем данные пользователя и карточки с сервера
  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser({ ...currentUser, ...user });
          setCards(cards);
        })
        .catch((err) => {
          console.error(`Ошибка при получении данных: ${err}`);
          setErrorMessage('Произошла ошибка при получении данных');
        })
    }
  }, [loggedIn]);

  // закрываем все попапы
  function closeAllPopups() {
    setSelectedCard({});
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setInfoToolTipPopup(false);
    setIsImagePopupOpen(false);
    setConfirmPopup(false);
  }

  // функция закрытия по клику на overlay или escape
  function handleCloseClick(event) {
    if (event.key === 'Escape' || event.target.classList.contains('popup_opened')) {
      closeAllPopups();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleCloseClick);
    document.addEventListener('click', handleCloseClick);
    return () => {
      document.removeEventListener('keydown', handleCloseClick);
      document.removeEventListener('click', handleCloseClick);
    };
  }, []);

  // устанавливаем tooltip response на попап
  function showTooltipResponse(signedIn, tooltipMessage) {
    setInfoToolTipPopup(true);
    setSignedIn(signedIn);
    setTooltipMessage(tooltipMessage);
  };

  // функции открытия попапов
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  // функция загрузки для вывода текста
  function renderDownload() {
    setDownload((download) => !download);
  }

  // функция лайка карточки
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(like => like._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((prevCards) => prevCards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.error(`Ошибка лайка: ${err}`);
      })
  }

  // функция удаления карточки
  function handleCardDelete() {
    api.deleteCard(selectedCard._id)
      .then(() => {
        setCards((prevCards) => prevCards.filter((c) => c._id !== selectedCard._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.error(`Ошибка удаления карточки: ${err}`);
      })
      .finally(() => renderDownload());
  }

  // функция подтверждения удаления карточки
  function handleCardConfirmDelete(card) {
    setSelectedCard(card);
    setConfirmPopup(true);
  }

  // обновление инфо о пользователе
  function handleUpdateUser(userData) {
    api.editUserInfo(userData)
      .then((newUserInfo) => {
        setCurrentUser({ ...currentUser, ...newUserInfo })
        closeAllPopups();
      })
      .catch((err) => {
        console.error(`Ошибка обновления данных пользователя: ${err}`);
      })
      .finally(() => renderDownload())
  };

  // функция обновления аватара
  function handleUpdateAvatar(avatar) {
    api.updateProfileAvatar(avatar)
      .then((newAvatar) => {
        setCurrentUser({ ...currentUser, ...newAvatar })
        closeAllPopups();
      })
      .catch((err) => {
        console.error(`Ошибка обновления аватара: ${err}`);
      })
      .finally(() => renderDownload())
  };

  // функция добавления карточки
  function handleAddPlaceSubmit(card) {
    api.addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(`Ошибка добавления карточки: ${err}`);
      })
      .finally(() => renderDownload())
  };

  // функция выхода из ЛК
  function logOut() {
    setLoggedIn(false);
    setCurrentUser(initialUser);
    localStorage.removeItem('jwt');
  };

  // функция для регистрации пользователя
  function handleRegistration(regData) {
    apiAuth.register(regData)
      .then((response) => {
        if (response && response.data) {
          showTooltipResponse(true, "Вы успешно зарегистрировались!");
          navigate('/sign-in');
          setInfoToolTipPopup(true);
        }
      })
      .catch((err) => {
        console.error(`Ошибка попапа регистрации: ${err}`);
        showTooltipResponse(false, "Что-то пошло не так! Попробуйте ещё раз.");
        setInfoToolTipPopup(true);
      })
  };

  // функция для логина пользователя
  function handleLogin(loginData) {
    apiAuth.login(loginData)
      .then((response) => {
        if (response && response.token) {
          setCurrentUser({ ...currentUser, email: loginData.email });
          localStorage.setItem('jwt', response.token);
          checkToken();
        }
      })
      .catch((err) => {
        console.error(`Ошибка попапа регистрации: ${err}`);
        showTooltipResponse(false, "Что-то пошло не так! Попробуйте ещё раз.");
      })
  };

  // функция проверки токена
  function checkToken() {
    const token = localStorage.getItem('jwt');

    if (token) {
      apiAuth.checkToken(token)
        .then((response) => {
          if (response && response.data) {
            setLoggedIn(true);
            setCurrentUser({ ...currentUser, email: response.data.email });
            navigate('/');
          }
        })
        .catch((err) => {
          console.error(`Ошибка получения токена: ${err}`);
          showTooltipResponse(false, "Что-то пошло не так! Попробуйте ещё раз.");
        })
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>

        <Header
          email={currentUser.email}
          loggedIn={loggedIn}
          logOut={logOut} />

        <Routes>
          <Route path="/sign-up" element={<Register onRegister={handleRegistration} />} />
          <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
          <Route path='/'
            element={<ProtectedRoute
              loggedIn={loggedIn}
              element={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardConfirmDelete}
              cards={cards}
            />} />
        </Routes>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          download={download}
          renderDownload={renderDownload}
          inputError={inputError}
          setInputError={setInputError}
          sameInputError={sameInputError}
          setSameInputError={setSameInputError}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          download={download}
          renderDownload={renderDownload}
          inputError={inputError}
          setInputError={setInputError}
          sameInputError={sameInputError}
          setSameInputError={setSameInputError}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          download={download}
          renderDownload={renderDownload}
          inputError={inputError}
          setInputError={setInputError}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />

        <PopupWithConfirm
          isOpen={confirmPopup}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          download={download}
          renderDownload={renderDownload}
        />

        <InfoToolTip
          name="tooltip"
          isOpen={infoToolTipPopup}
          onClose={closeAllPopups}
          signedIn={signedIn}
          tooltipMessage={tooltipMessage}
        />

        <Footer loggedIn={loggedIn} />
        <Error />
      </CurrentUserContext.Provider>
      {errorMessage && <Error message={errorMessage} />}
    </div>
  );
}

export default App;