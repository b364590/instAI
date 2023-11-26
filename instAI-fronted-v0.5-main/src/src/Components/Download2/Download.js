import React, { useState } from 'react';
import loginstyle from "./Download.module.css";
import axios from 'axios';
import { NavLink, useLocation } from 'react-router-dom';
import "./Download.module.css";
function Download2() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [username, setUsername] = useState("");  // 沒有使用到 
  const [filename, setFilename] = useState(""); 

  // 文件選擇
  const handleFileSelect = async (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);

    // 過濾文件
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    const filteredFiles = fileArray.filter((file) =>
      allowedFileTypes.includes(file.type)
    );
   
    const fileNames = filteredFiles.map((file) => file.name);

    setFilename(fileNames);
    setSelectedFiles(filteredFiles);

    try {
      console.log('发送请求到URL:', 'http://localhost:8080/api/upload/download');//?filename=${filename}&username=${username}
      // const response = await fetch('http://localhost:8080/api/upload/download', {
      //   method: 'GET',
      //   body: formData,
      // });
      console.log(files)
        const formData = new FormData();
        for(let i =0;i<files.length;++i){
          formData.append('file', files[i]);
        }
      axios.post(`http://localhost:8080/api/upload/upload?filename=${fileNames}&username=${username}`,formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(response => {
          console.log(response.data);
          alert('download success')
          const downloadedFilename = response.headers['x-filename'];

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute("download",filename);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
        .catch(error => {
          console.error(error);
          console.error('文件上傳失敗');
          
        });
    } catch (error) {
      console.error('发生错误:', error);
    }

    const previews = filteredFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  // 文件下載 //modified
  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([file]));
    a.setAttribute("download", file.name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 處理刪除單一圖片
  const handleDeleteImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...imagePreviews];

    updatedFiles.splice(index, 1); 
    updatedPreviews.splice(index, 1); 

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  // 刪除預覽
  const handleDeleteAllPreviews = () => {
    setImagePreviews([]);
    setSelectedFiles([]);
  };

  // 下載預覽 //modified
  const handleDownloadAll = () => {
    selectedFiles.forEach((file) => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(new Blob([file]));
      console.log(a.href)
      a.setAttribute("download", file.name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <div className={loginstyle.background}>
      <h1>UPLOAD/DOWNLOAD</h1>
      <input type="file" accept="image/*" multiple name="images" onChange={handleFileSelect} />
      <div className="previews">
        {imagePreviews.map((preview, index) => (
          <span key={index} className="preview">
            <img
              src={preview}
              alt={`image ${index}`}
              style={{ width: '250px', height: '300px' }}
            />
            <button onClick={() => handleDeleteImage(index)}>刪除</button>
            <button onClick={() => handleDownload(selectedFiles[index])}>Download</button>
          </span>
        ))}
      </div>
      <button onClick={handleDeleteAllPreviews}>Remove all</button>
      <button onClick={handleDownloadAll}>Download All</button>
      <div><NavLink to="/Step?id=${type ? id : userid}&project=${projectName}"><button>Done</button></NavLink></div>
    </div>
  );
}

export default Download2;

