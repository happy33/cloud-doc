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
  const node = useRef(null);
  const closeEdit = (editItem) => {
    setEditStatus(false);
    setValue("");
    if (editItem.isNew) {
      onFileDelete(editItem.id);
    }
  };
  useEffect(() => {
    const editItem = files.find((file) => file.id === editStatus);
    if (enterPress && editStatus && value.trim() !== "") {
      onSaveEdit(editItem.id, value);
      setEditStatus(false);
      setValue("");
    } else if (escPress && editStatus) {
      closeEdit(editItem);
    }
  });
  useEffect(() => {
    const newFile = files.find((file) => file.isNew);
    console.log(newFile);
    if (newFile) {
      setEditStatus(newFile.id);
      setValue("");
    }
  }, [files]);
  useEffect(() => {
    if (editStatus) {
      node.current.focus();
    }
  }, [editStatus]);
  return (
    <ul className="list-group list-group-flush file-list">
      {files.map((file) => {
        return (
          <li
            className="list-group-item bg-light d-flex align-items-center row file-item gx-0"
            key={file.id}
          >
            <>
              {file.id !== editStatus && !file.isNew && (
                <>
                  <span className="col-2">
                    <FontAwesomeIcon icon={faMarkdown} size="lg" />
                  </span>
                  <span
                    className="col-6 c-link"
                    onClick={() => {
                      onFileClick(file.id);
                    }}
                  >
                    {file.title}
                  </span>
                  <button
                    className="col-2 icon-button"
                    onClick={() => {
                      setEditStatus(file.id);
                      setValue(file.title);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} size="lg" title="编辑" />
                  </button>
                  <button
                    className="col-2 icon-button"
                    onClick={() => {
                      onFileDelete(file.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" title="删除" />
                  </button>
                </>
              )}
              {(file.id === editStatus || file.isNew === true) && (
                <>
                  <input
                    className="form-control-inline col-10"
                    onChange={(event) => {
                      setValue(event.target.value);
                    }}
                    value={value}
                    ref={node}
                    placeholder="请输入文件名称"
                  />
                  <button
                    type="button"
                    className="icon-button col-2"
                    onClick={() => {
                      closeEdit(file);
                    }}
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
