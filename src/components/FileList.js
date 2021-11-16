import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import useKeyPress from "../hooks/useKeyPress";
import PropTypes from "prop-types";

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState("");
  const enterPress = useKeyPress(13);
  const escPress = useKeyPress(27);
  const closeSearch = () => {
    setEditStatus(false);
    setValue("");
  };
  useEffect(() => {
    if (enterPress && editStatus) {
      const editItem = files.find((file) => file.id === editStatus);
      onSaveEdit(editItem.id, value);
      setEditStatus(false);
      setValue("");
    } else if (escPress && editStatus) {
      closeSearch();
    }
  }, []);
  return (
    <ul className="list-group list-group-flush file-list">
      {files.map((file) => {
        return (
          <li
            className="list-group-item bg-light d-flex align-items-center row file-item"
            key={file.id}
          >
            <>
              {file.id !== editStatus && (
                <>
                  <span className="col-2">
                    <FontAwesomeIcon icon={faMarkdown} size="lg" />
                  </span>
                  <span
                    className="col-8 c-link"
                    onClick={() => {
                      onFileClick(file.id);
                    }}
                  >
                    {file.title}
                  </span>
                  <button
                    className="col-1 icon-button"
                    onClick={() => {
                      setEditStatus(file.id);
                      setValue(file.title);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} size="lg" title="编辑" />
                  </button>
                  <button className="col-1 icon-button">
                    <FontAwesomeIcon
                      icon={faTrash}
                      size="lg"
                      title="删除"
                      onClick={() => {
                        onFileDelete(file.id);
                      }}
                    />
                  </button>
                </>
              )}
              {file.id === editStatus && (
                <>
                  <input
                    className="form-control-inline col-10"
                    onChange={(event) => {
                      setValue(event.target.value);
                    }}
                    value={value}
                  />
                  <button
                    type="button"
                    className="icon-button col-2"
                    onClick={closeSearch}
                  >
                    <FontAwesomeIcon icon={faTimes} title="关闭" size="lg" />
                  </button>
                </>
              )}
            </>
          </li>
        );
      })}
    </ul>
  );
};

export default FileList;

FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onSaveEdit: PropTypes.func,
  onFileDelete: PropTypes.func,
};
