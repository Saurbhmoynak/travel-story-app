import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder = "Password" }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-cyan-600/5 px-5 rounded mb-3">
      <input
        type={isShowPassword ? "text":"password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-[15px] bg-transparent py-3 mr-3 rounded outline-none"
      />

      {!isShowPassword ? (
        <FaRegEyeSlash
          size={22}
          className="text-cyan-500 cursor-pointer"
          onClick={()=>toggleShowPassword()}
        />
      ) : (
        <FaRegEye
          size={22}
          className="text-orange-600 cursor-pointer"
          onClick={()=>toggleShowPassword()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
