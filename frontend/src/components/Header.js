import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import close from '../images/close-button.svg';
import logo from '../images/logo.svg';
import menu from '../images/header-menu-sign.svg';

function Header(props) {
    const { loggedIn, email, logOut } = props;

    // переменные состояния для значка меню
    const [showMenu, setShowMenu] = useState(false);

    const location = useLocation();
    const textLink = location.pathname === '/sign-in' ? 'Регистрация' : 'Войти';
    const buttonText = loggedIn ? 'Выйти' : textLink;

    // функция для смены значка меню на его содержимое
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <header className="header">
            {loggedIn && showMenu && (
                <div className="header__unfold-menu">
                    <p className="header__unfold-email">{email}</p>
                    <button className="header__link header__unfold-logout" onClick={logOut}>
                        {buttonText}
                    </button>
                </div>
            )}

            <div className="header__main">
                <img src={logo} alt="Логотип Место" className="header__logo" />
                <div className="header__links">
                    {!loggedIn && (
                        <Link to={location.pathname === "/sign-in" ? "/sign-up" : "/sign-in"}
                            className="header__link header__logout">
                            {buttonText}
                        </Link>
                    )}

                    {loggedIn && (
                        <>
                            {showMenu ? (
                                <img
                                    src={close}
                                    alt="Значок закрытия меню"
                                    className="header__menu-sign"
                                    onClick={toggleMenu}
                                />
                            ) : (
                                <img
                                    src={menu}
                                    alt="Значок меню"
                                    className="header__menu-sign"
                                    onClick={toggleMenu}
                                />
                            )}

                            <p className="header__mobile-email">{email}</p>
                            <button className="header__mobile-logout" onClick={logOut}>
                                {buttonText}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
