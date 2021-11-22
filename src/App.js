import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "easymde/dist/easymde.min.css";
import FileSearch from "./components/FileSearch";
import React, { useState , useMemo } from "react";
import FileList from "./components/FileList";
import defaultFiles from "./utils/defaultFile";
import ButtonBtn from "./components/BottomBtn";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import TabList from "./components/TabList";
import SimpleMDE from "react-simplemde-editor";
import useKeyPress from "./hooks/useKeyPress";

function App() {
  const [files, setFiles] = useState(defaultFiles);
  const [activeFileID, setActiveFileID] = useState("");
  const [openedFileIDs, setOpenedFileIDs] = useState([]);
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
  const enterPress = useKeyPress(13);
  const openedFiles = openedFileIDs.map((openID) => {
    return files.find((file) => file.id === openID);
  });
  const activeFile = files.find((file) => file.id === activeFileID);
  const fileClick = (fileID) => {
    setActiveFileID(fileID);
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID]);
    }
  };
  const tabClick = (fileID) => {
    setActiveFileID(fileID);
  };
  const tabClose = (id) => {
    const tabIndex = openedFileIDs.indexOf(id);
    if (id === activeFileID) {
      if (openedFileIDs.length > 1) {
        const lastFileID =
          tabIndex > 0
            ? openedFileIDs[tabIndex - 1]
            : openedFileIDs[tabIndex + 1];
        setActiveFileID(lastFileID);
      } else {
        setActiveFileID("");
      }
    }
    const tabSWithout = openedFileIDs.filter((fileID) => fileID !== id);
    setOpenedFileIDs(tabSWithout);
  };
  const fileChange = (id,value) => {
    console.log(value,id)
    const newFiles = files.map(file => {
      if (file.id === id) {
        file.body = value;
      }
      return file;
    });
    setFiles(newFiles);  
    if (!unsavedFileIDs.includes(activeFile.id)) {
      setUnsavedFileIDs([...unsavedFileIDs,activeFile.id]);
    }
  }
  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      minHeight: "670px"
    };
  }, []);
  const deleteFile = (id) => {
    const newFiles = files.filter((file)=>{
      if(file.id !== id){
        return file
      }
    })
    setFiles(newFiles)
  }
  const saveEdit = (id,value) => {
    const newFiles = files.map((file) => {
      if(file.id === id){
        file.title = value
      }
      return file
    })
    if(enterPress){setFiles(newFiles)}
    console.log("ok")
  }

  return (
    <div className="App container-fluid g-0">
      <div className="row">
        <div className="col-3 bg-light left-panel gx-0">
          <FileSearch
            title="我的云文档"
            onFileSearch={(value) => {
              console.log(value);
            }}
          />
          <FileList
            files={files}
            onFileClick={fileClick}
            onFileDelete={(id) => {
              deleteFile(id)
            }}
            onSaveEdit={(id, value) => {
              console.log(id,value)
            }}
          />
          <div className="row g-0 button-group">
            <div className="col d-grid gap-2">
              <ButtonBtn text="新建" icon={faPlus} colorClass="btn-primary" />
            </div>
            <div className="col d-grid gap-2">
              <ButtonBtn
                text="导入"
                icon={faFileImport}
                colorClass="btn-success"
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {!activeFile && (
            <div className="start-page">选择或创建新的MarkDown文档</div>
          )}
          {activeFile && (
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value)=>{fileChange(activeFile.id,value)}}
                options={autofocusNoSpellcheckerOptions}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
