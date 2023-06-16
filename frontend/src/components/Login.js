import SignForm from "./SignForm";

function Login(props) {

    return (
        <SignForm
            onSubmit={props.onLogin}
            title="Вход"
            buttonText="Войти"
            isRegister={false}
        />
    )
}

export default Login;