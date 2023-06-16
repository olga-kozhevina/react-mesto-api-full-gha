// функции валидации для ссылки
export const validateURL = (value) => {
  const urlRegExp = /^(ftp|http|https):\/\/[^ "]+$/i;
  if (!value) {
    return 'Поле не может быть пустым';
  } else if (!urlRegExp.test(value)) {
    return 'Пожалуйста, введите действительный URL-адрес, начинающийся с http:// или https://';
  }
  return '';
};

// функции валидации для текстовых полей
export const validateInput = (value) => {
  if (!value.trim()) {
    return 'Поле не может быть пустым';
  } else if (value.length < 2) {
    return 'Поле должно содержать не менее 2 символов';
  } else {
    return '';
  }
};

// функции валидации для email и password
export const validateEmail = (value) => {
  if (!value) {
    return 'Email не может быть пустым';
  }
  const pattern = /^[\w-.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!pattern.test(value)) {
    return 'Введите корректный email: name@example.ru';
  }
  return '';
};

export const validatePassword = (value) => {
  if (!value) {
    return 'Поле не может быть пустым';
  }
  if (value.length < 8) {
    return 'Пароль должен содержать не менее 8 символов';
  }
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    return 'Пароль может состоять только из букв A-Z, a-z, цифр 0-9 и символов -_';
  }
  return '';
};

