import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'
import FileSearch from './components/FileSearch'
import React, { useState, useMemo } from 'react'
import FileList from './components/FileList'
import ButtonBtn from './components/BottomBtn'
import { faPlus, faFileImport, faSave } from '@fortawesome/free-solid-svg-icons'
import TabList from './components/TabList'
import SimpleMDE from 'react-simplemde-editor'
import { v4 as uuidv4 } from 'uuid'
import { flattenArr, objToArr } from './utils/helper'
import fileHelper from './utils/fileHelper'

//require node.js modules
const { join } = window.require('path')
const remote = window.require('@electron/remote')
const Store = window.require('electron-store')
const fileStore = new Store({ name: 'Files Data' })
console.log(fileStore)
const saveFilesToStore = files => {
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt } = file
    result[id] = {
      id,
      path,
      title,
      createdAt
    }
    return result
  }, {})
  fileStore.set('files', filesStoreObj)
}
function App() {
  const [files, setFiles] = useState(fileStore.get('files') || {})
  const [activeFileID, setActiveFileID] = useState('')
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  const [searchedFiles, setsearchedFiles] = useState([])

  const saveLocation = remote.app.getPath('appData')
  const filesArr = objToArr(files)
  const activeFile = files[activeFileID]
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const fileListArr = searchedFiles.length > 0 ? searchedFiles : filesArr
  //新建文件
  const createNewFile = () => {
    const newID = uuidv4()
    fileChangePart(newID, {
      id: newID,
      body: '## 请输出MarkDown',
      title: '',
      createdAt: new Date().getTime(),
      isNew: true
    })
  }
  //点击文件栏
  const fileClick = fileID => {
    setActiveFileID(fileID)
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID])
    }
  }
  //点击tab栏
  const tabClick = fileID => {
    setActiveFileID(fileID)
  }
  //关闭tab标签
  const tabClose = id => {
    const tabIndex = openedFileIDs.indexOf(id)
    if (id === activeFileID) {
      if (openedFileIDs.length > 1) {
        const lastFileID = tabIndex > 0 ? openedFileIDs[tabIndex - 1] : openedFileIDs[tabIndex + 1]
        setActiveFileID(lastFileID)
      } else {
        setActiveFileID('')
      }
    }
    const tabsWithout = openedFileIDs.filter(fileID => fileID !== id)
    setOpenedFileIDs(tabsWithout)
  }
  //文件局部改变
  const fileChangePart = (id, obj) => {
    const newFile = { ...files[id], ...obj }
    setFiles({ ...files, [id]: newFile })
  }
  //编辑文件内容
  const fileChange = (id, value) => {
    fileChangePart(id, { body: value })
    if (!unsavedFileIDs.includes(activeFile.id)) {
      setUnsavedFileIDs([...unsavedFileIDs, activeFile.id])
    }
  }
  //自动focus
  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      minHeight: '670px'
    }
  }, [])
  //文件栏删除文件
  const deleteFile = id => {
    if (files[id].isNew) {
      delete files[id]
      const { [id]: value, ...afterDelete } = files
      setFiles(afterDelete)
    } else {
      fileHelper.deleteFile(files[id].path).then(() => {
        const { [id]: value, ...afterDelete } = files
        setFiles(afterDelete)
        saveFilesToStore(afterDelete)
        tabClose(id)
      })
    }
  }
  //编辑文件名
  const updateFileName = (id, title, isNew) => {
    const newPath = join(saveLocation, `${title}.md`)
    const modifiedFile = { ...files[id], title: title, isNew: false, path: newPath }
    const newFiles = { ...files, [id]: modifiedFile }
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    } else {
      const oldPath = join(saveLocation, `${files[id].title}.md`)
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    }
  }
  //搜索文件
  const fileSearch = key => {
    const searchedFileList = filesArr.filter(file => file.title.includes(key))
    setsearchedFiles(searchedFileList)
  }
  //保存文件
  const saveCurrentFile = () => {
    fileHelper.writeFile(join(saveLocation, `${activeFile.title}.md`), activeFile.body).then(() => {
      setUnsavedFileIDs(unsavedFileIDs.filter(id => id !== activeFile.id))
    })
  }
  //导入文件
  const importFiles = () => {
    remote.dialog
      .showOpenDialog({
        title: '选择导入的MarkDown文件',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'MarkDownFiles', extensions: ['md'] }]
      })
      .then(res => {
        console.log(res.filePaths)
      })
  }

  return (
    <div className="App container-fluid g-0">
      <div className="row">
        <div className="col-3 bg-light left-panel gx-0">
          <FileSearch title="我的云文档" onFileSearch={fileSearch} />
          <FileList
            files={fileListArr}
            onFileClick={fileClick}
            onFileDelete={id => {
              deleteFile(id)
            }}
            onSaveEdit={updateFileName}
          />
          <div className="row g-0 button-group">
            <div className="col d-grid gap-2">
              <ButtonBtn
                text="新建"
                icon={faPlus}
                colorClass="btn-primary"
                onBtnClick={createNewFile}
              />
            </div>
            <div className="col d-grid gap-2">
              <ButtonBtn
                text="导入"
                icon={faFileImport}
                colorClass="btn-success"
                onBtnClick={importFiles}
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {!activeFile && <div className="start-page">选择或创建新的MarkDown文档</div>}
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
                onChange={value => {
                  fileChange(activeFile.id, value)
                }}
                options={autofocusNoSpellcheckerOptions}
              />
              <ButtonBtn
                text="保存"
                icon={faSave}
                colorClass="btn-success"
                onBtnClick={saveCurrentFile}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
