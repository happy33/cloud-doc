import { useState, useEffect } from "react";

const useKeyPress = (targetKeyCode) => {
  const [keyPress, setKeyPress] = useState(false);
  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === targetKeyCode) {
      setKeyPress(true);
    }
  };
  const handleKeyUp = ({ keyCode }) => {
    if (keyCode === targetKeyCode) {
      setKeyPress(false);
    }
  };
  useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return keyPress;
};

export default useKeyPress;
