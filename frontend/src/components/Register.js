import SignForm from "./SignForm";

function Register(props) {

    return (
        <SignForm
            onSubmit={props.onRegister}
            title="Регистрация"
            buttonText="Зарегистрироваться"
            isRegister={true}
        />
    )
}

export default Register;