import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import defaultFiles from "./utils/defaultFile";
import ButtonBtn from "./components/BottomBtn";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import TabList from "./components/TabList";

function App() {
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
          <div className="row g-0">
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
          <TabList
            files={defaultFiles}
            activeId="2"
            onTabClick={(id) => {
              console.log(id);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
