import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import useKeyPress from "../hooks/useKeyPress";
import PropTypes from "prop-types";

const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState("");
  const enterPress = useKeyPress(13);
  const escPress = useKeyPress(27);
  let node = useRef(null);

  const closeSearch = () => {
    setInputActive(false);
    setValue("");
    onFileSearch("");
  };
  useEffect(() => {
    if (enterPress && inputActive) {
      onFileSearch(value);
    } else if (escPress && inputActive) {
      closeSearch();
    }
  });
  useEffect(() => {
    if (inputActive) {
      node.current.focus();
    }
  }, [inputActive]);
  return (
    <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
      {!inputActive && (
        <>
          <span>{title}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => {
              setInputActive(true);
            }}
          >
            <FontAwesomeIcon icon={faSearch} title="搜索" size="lg" />
          </button>
        </>
      )}
      {inputActive && (
        <>
          <input
            className="form-control"
            value={value}
            ref={node}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
          <button type="button" className="icon-button" onClick={closeSearch}>
            <FontAwesomeIcon icon={faTimes} title="关闭" size="lg" />
          </button>
        </>
      )}
    </div>
  );
};

export default FileSearch;

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired,
};
FileSearch.defaultProps = {
  title: "我的云文档",
};
