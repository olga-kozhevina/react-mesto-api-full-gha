import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/Validation';

function SignForm(props) {
    const { title, buttonText, onSubmit, isRegister } = props;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // переменные для вывод ошибок валидации
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const disabled = !email || emailError || !password || passwordError;

    function handleEmail(evt) {
        const { value } = evt.target;
        setEmail(value);
        setEmailError(validateEmail(value));
    }

    function handlePassword(evt) {
        const { value } = evt.target;
        setPassword(value);
        setPasswordError(validatePassword(value));
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        onSubmit({ email, password });
    }

    return (
        <form
            noValidate
            className="form"
            name="signform"
            onSubmit={handleSubmit}
        >
            <h3 className="form__title">{title}</h3>
            <fieldset className="form__inputs">
                <input
                    type="email"
                    className="form__input"
                    id="email"
                    name="email"
                    required=""
                    placeholder="Email"
                    value={email}
                    onChange={handleEmail} />
                <span className={`popup__error email-error ${emailError && 'popup__error_active'}`}>{emailError}</span>
                <input
                    type="password"
                    className="form__input"
                    id="password"
                    name="password"
                    required=""
                    placeholder="Пароль"
                    minLength={8}
                    maxLength={50}
                    value={password}
                    onChange={handlePassword} />
                <span className={`popup__error password-error ${passwordError && 'popup__error_active'}`}>{passwordError}</span>
            </fieldset>

            <button
                className={`form__submit-button ${disabled ? 'popup__submit-button_disabled' : ''}`}
                type="submit"
                disabled={disabled}
            >{buttonText}
            </button>
            {isRegister && <span className="form__subtitle">Уже зарегистрированы? <Link to="/sign-in" className="form__link">Войти</Link></span>}
        </form>
    )
}

export default SignForm;