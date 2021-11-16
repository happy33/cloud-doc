import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import defaultFiles from "./utils/defaultFile";
import ButtonBtn from "./components/BottomBtn";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-6 bg-light left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={(value) => {
              console.log(value);
            }}
          />
          <FileList
            files={defaultFiles}
            onFileClick={(id) => {
              console.log(id, "click");
            }}
            onFileDelete={(id) => {
              console.log(id, "delete");
            }}
            onSaveEdit={(id, value) => {
              console.log(id, "save", "value", value);
            }}
          />
          <div className="row">
            <div className="col">
              <ButtonBtn text="新建" icon={faPlus} colorClass="btn-primary" />
            </div>
            <div className="col">
              <ButtonBtn
                text="导入"
                icon={faFileImport}
                colorClass="btn-success"
              />
            </div>
          </div>
        </div>
        <div className="col-6 bg-primary right-panel">
          <h1>this is the right</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
