import { useState, useRef } from "react";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

import uniCalcLogo from "assets/images/logo-ct.svg";

import "./LoginStyle.css";

export const LoginContainer = () => {
  //Context variables
  const { signUp, login } = useAuth();

  const navigate = useNavigate();

  // Regex for email and password.
  const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const PASSWORD_REGEX = /^(?=.*?[#?!@$%^&/*-])/;

  // State for email, username and password.
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Errors and notifications.
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [fillAllFieldsError, setFillAllFieldsError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [generalError, setGeneralError] = useState(false);
  const [fireBaseError, setFireBaseError] = useState("");
  const [fireBaseNotification, setFireBaseNotification] = useState(false);

  // useRef for the the change of the container.
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSignUp = () => {
    setIsSignIn(false);
  };

  const handleSignIn = () => {
    setIsSignIn(true);
  };

  const errorFireBase = (errorCode) => {
    switch (errorCode.substr(5)) {
      case "ERROR_EMAIL_ALREADY_IN_USE":
      case "account-exists-with-different-credential":
      case "email-already-in-use":
        return "El email esta en uso, prueba con otro o inicia sesión";
      case "ERROR_WRONG_PASSWORD":
      case "wrong-password":
        return "Contraseña erronea";
      case "ERROR_USER_NOT_FOUND":
      case "user-not-found":
        return "Usuario no encontrado";
      case "ERROR_INVALID_EMAIL":
      case "invalid-email":
        return "Email invalido";
      case "ERROR_INVALID_PASSWORD":
      case "invalid-password":
        return "Contraseña invalida, debe tener más de 6 caracteres";
      default:
        return "Login fallido, por favor intenta otra vez";
    }
  };

  // Function to add a new register.

  const addRegister = async (e) => {
    e.preventDefault();

    // Error management.

    if (email === "" || password === "" || userName === "" || passwordConfirm === "") {
      setFillAllFieldsError(true);
      setTimeout(() => {
        setFillAllFieldsError(false);
      }, 5000);
      return;
    } else {
      if (password !== passwordConfirm) {
        setPasswordConfirmError(true);
        setTimeout(() => {
          setPasswordConfirmError(false);
        }, 5000);
        return;
      }
      if (!EMAIL_REGEX.test(email) && PASSWORD_REGEX.test(password)) {
        setEmailError(true);
        setTimeout(() => {
          setEmailError(false);
        }, 5000);
        return;
      } else if (EMAIL_REGEX.test(email) && !PASSWORD_REGEX.test(password)) {
        setPasswordError(true);
        setTimeout(() => {
          setPasswordError(false);
        }, 5000);
        return;
      } else if (!EMAIL_REGEX.test(email) && !PASSWORD_REGEX.test(password)) {
        setGeneralError(true);
        setTimeout(() => {
          setGeneralError(false);
        }, 5000);
        return;
      }
    }

    // If there is no error, the register is added.

    try {
      await signUp(email, password, userName);
      navigate("/");
    } catch (error) {
      setFireBaseError(errorFireBase(error.code));
      setFireBaseNotification(true);
      setTimeout(() => {
        setFireBaseNotification(false);
      }, 5000);
      return;
    }
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
    }, 5000);
    setEmail("");
    setPassword("");
    setUserName("");
  };

  const handleSubmmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.log("estoy aqui");
      setFireBaseError(errorFireBase(error.code));
      setFireBaseNotification(true);
      setTimeout(() => {
        setFireBaseNotification(false);
      }, 5000);
      return;
    }
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
    }, 5000);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      {/* Error FireBase*/}
      {fireBaseNotification && (
        <div className="notification" id="warn-notification">
          {fireBaseError}
        </div>
      )}

      {/* Error when the password is not properly written */}
      {passwordError && (
        <div className="notification" id="warn-notification">
          La contraseña debe tener al menos un caracter especial. Por ejemplo: #, ?, !, @, $, %, ^,
          &, /, * y -
        </div>
      )}

      {/* Error for password different to confirm */}
      {passwordConfirmError && (
        <div className="notification" id="warn-notification">
          Las contraseñas no coinciden.
        </div>
      )}


      {/* Error when the email is not properly written */}
      {emailError && (
        <div className="notification" id="warn-notification">
          El email no es válido.
        </div>
      )}

      {/* Both of them have an error */}
      {generalError && (
        <div className="notification" id="warn-notification">
          La contraseña debe tener al menos un caracter especial. Por ejemplo: #, ?, !, @, $, %, ^,
          &, /, * y -
          <br />
          El email no es válido.
        </div>
      )}

      {/* Error when the user doesn't fill all the fields */}

      {fillAllFieldsError && (
        <div className="notification" id="warn-notification">
          Por favor, rellena todos los campos.
        </div>
      )}

      {/* Notification when the email has been sent succesfully */}
      {registerSuccess && (
        <div className="notification" id="success-notification">
          You have been registered successfully.
        </div>
      )}

      <div className="container">
        <div className="signInUp">
          {/* Sign-in Part */}
          <div className={`box signin ${isSignIn ? "active" : ""}`}>
            <h1>Bienvenido de Vuelta!</h1>
            <p>
              Para ver tu contenido inicia sesión con tus datos personales
            </p>
            <button className="signinBtn" onClick={handleSignIn}>
              Iniciar Sesion
            </button>
          </div>

          {/* Sign-up Part */}
          <div className={`box signup ${!isSignIn ? "active" : ""}`}>
            <h1>Hola!</h1>
            <p>
              Ingresa tus datos persononales para registrarte
            </p>
            <button className="signupBtn" onClick={handleSignUp}>
              Registrarse
            </button>
          </div>
        </div>

        {/* Sign-in/Sign-up Form */}
        <div className={`form-box ${isSignIn ? "" : "active"}`}>
          {/* Sign-in Form */}
          <div className="form signinForm">
            <img
              src={uniCalcLogo}
              alt=""
              width={80}
              height={80}
            />
            <form>
              <a href="#" className="google">
                <i className="fab fa-google-plus-g"></i>Login with Google
              </a>
              <a href="#" className="facebook">
                <i className="fab fa-facebook-f"></i>Login with Facebook
              </a>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="submit-btn">
                <input type="submit" value="Iniciar Sesion" onClick={handleSubmmit}/>
              </div>
              <a href="#" className="forget">
                Forget Password
              </a>
            </form>
          </div>

          {/* Sign-up Form */}
          <div className="form signupForm">
            <img
              src={uniCalcLogo}
              alt=""
              width={80}
              height={80}
            />
            <form>
              <input
                type="text"
                placeholder="Usuario"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <div className="submit-btn">
                <input type="submit" value="Registrate" onClick={addRegister} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
