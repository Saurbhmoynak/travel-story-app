import React from "react";
import { useEffect, useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import apiRequest from "../../utils/apiRequest";
import bgImage from '../../assets/images/bg-image2.jpg';


const Login = () => {
  const travelQuotes = [
    "Every journey we take is a chapter in our life’s story, filled with emotions, adventures, and unforgettable moments.",
    "Each destination adds a new chapter to our lives, shaping our memories and broadening our horizons.",
    "Travel is more than just places; it's about the people we meet, the emotions we feel, and the stories we create.",
    "From world-famous landmarks to hidden gems, every step we take carries a unique and beautiful story.",
    "Capture your wanderlust in words and memories, turning fleeting moments into lasting treasures.",
  ];

  const [quote, setQuote] = useState(travelQuotes[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(travelQuotes[Math.floor(Math.random() * travelQuotes.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    // Step 1: Validate Email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address"); // Set error message if email is invalid
      return; // Stop execution if validation fails
    }

    // Step 2: Check if Password is Entered
    if (!password) {
      setError("Please enter the password"); // Set error message if password is empty
      return; // Stop execution if password is missing
    }

    // Step 3: Clear Error Messages (if all fields are valid)
    setError("");

    // Step 4: Proceed with login API call (if needed)
    try {
      const response = await apiRequest.post("/login", {
        email: email,
        password: password,
      });
      //handle successful login response

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      //handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-100 overflow-hidden relative ">
      <div className="login-ui-box right-10 -top" />
      <div className="login-ui-box bg-cyan-200 -bottom-11 left-1/14" />
      <div className="container h-screen flex items-center justify-center px-20 mx-auto relative ">
        <div style={{ backgroundImage: `url(${bgImage})` }} className="w-2/4 h-[90vh] flex items-start  bg-cover bg-center rounded-lg p-10 ">
          <div>
            <h4 className="text-5xl text-white font-bold leading-[58px]">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-[16px] text-white leading-6 pr-7 mt-4">
              {quote}
            </p>
          </div>
        </div>

        <div className="w-2/5 h-[75vh] bg-white rounded-r-lg p-16 shadow-lg shadow-cyan-200 ">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
              }}
              className="input-box"
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => {
                setPassword(target.value);
              }}
              className="input-box"
            />

            {error && <p className="text-red-600 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary cursor-pointer">
              LOGIN
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button
              type="submit"
              className="btn-primary btn-light cursor-pointer"
              onClick={() => {
                navigate("/signUp");
              }}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;