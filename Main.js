function Main(){
}

Main.initialize = function(){
  //get document elements
  this.textarea = document.getElementById("textarea");
  this.button = document.getElementById("button");
  this.input = document.getElementById("input");

  //calculate base64 decode
  this.resultBase64 = window.location.hash.substring(1);
  this.resultBinary = "";
  this.result = null;

  //show download button and result[image, zip, text, ...]
  this.resultMode = "";
  this.resultDownload = false;

  //download filename
  this.resultName = "";
  this.resultExtension = "";

  //checkException
  this.exceptionMessage = this.checkException();
  this.initializeCache();

  //run
  if(this.exceptionMessage){
    this.showDecode();
  }else{
    this.showResult();
  }
}

Main.initializeCache = function(){
  const resultUrlCache = sessionStorage.getItem("resultUrlCache");
  if (resultUrlCache){
    URL.revokeObjectURL(resultUrlCache);
    sessionStorage.removeItem("resultUrlCache");
  }
}

Main.checkException = function(){
  if(this.resultBase64){
    return "여기에 base64 코드를 입력하거나 붙여넣기해주세요...";
  }
  try{atob(this.resultBase64)}catch(e){
    return "잘못된 base64 코드입니다. 여기에 base64 코드를 입력하거나 붙여넣기해주세요...";
  }
  return "";
}

Main.showDecode = function(){
  this.textarea.value = "";
  this.textarea.readOnly = false;
  this.textarea.placeholder = exceptionMessage + "여기에 base64 코드를 입력하거나 붙여넣기해주세요...";
  this.textarea.style = "";
  this.input.value = "";
  this.input.placeholder = "";
  this.input.style = "display:none";
  this.button.innerText = "디코드";
  this.button.onclick = this.onDecode.bind(this);
  this.button.style = "";
}

Main.showResult = function(){
  this.calcResultFirst();
  
  this.textarea.value = "";
  this.textarea.readOnly = true;
  this.textarea.placeholder = "";
  this.textarea.style = resultMode ? "" : "display:none";
  this.input.value = "";
  this.input.placeholder = fileName;
  this.input.style = isDownloadMode ? "" : "display:none";
  this.button.innerText = "다운로드";
  this.button.onclick = this.onDownload.bind(this);
  this.button.style = isDownloadMode ? "" : "display:none";

  this.calcResultLast();
}

Main.calcResultFirst = function(){
  this.resultBinary = atob(this.resultBase64);
  this.resultExtension = ExtensionChecker.getExtension(this.resultBinary);
  this.resultName = decodeURIComponent(document.location.search.substring(1)) || "result" + this.fileExtension;

  //check mode
  if([".png",".jpg",".gif"].includes(this.fileExtension)){
    this.resultMode = "img";
    this.resultDownload = true;
  }else if(".zip" === this.fileExtension){
    this.resultMode = "zip";
    this.resultDownload = true;
  }else if(".txt" === this.fileExtension){
    this.resultMode = "text";
  }else{
    this.resultDownload = true;
  }
}

Main.calcResultLast = function(){
  if(this.resultMode==="text"){
    this.textarea.value = binaryToUtf8(this.resultBinary);
    
  }else if(this.resultMode==="img"){
    const result = binaryToBlob(this.resultBinary);
    const resultUrlCache = URL.createObjectURL(result);
    this.textarea.style = "background-size: contain; background-repeat: no-repeat; background-image: url("+resultUrlCache+")";
    
  }else if(this.resultMode==="zip"){
    const zip = new JSZip();
    const textarea = this.textarea;
    
    zip.loadAsync(this.resultBinary).then(zipFile => {
      zip.forEach((path, entry) => {
        const size = entry._data.uncompressedSize;
        const sizeName = (size<1<<10)?"BYTE":(size<1<<20)?"KB":(size<1<<30)?"MB":"GB";
        const sizeResult = size/((size<1<<10)?1:(size<1<<20)?1<<10:(size<1<<30)?1<<20:1<<30);
        textarea.value += `${path} [${sizeResult.toFixed(2)*1}${sizeName}]\n`;
      });
    });
  }
}

Main.onDecode = function(){
  window.location.hash = "#" + this.textarea.value;
}

Main.onDownload = function(){
  this.resultBinary = atob(this.base64);
  this.result = binaryToBlob(this.resultBinary);
  const url = URL.createObjectURL(this.result);
  const fileName = input.value || input.placeholder || "result";
  const fileExtension = fileName.includes(".") ? "" : input.placeholder.includes(".") ? input.placeholder.substring(input.placeholder.lastIndexOf('.')) : ".txt";
  a = document.createElement("a");
  a.href = url;
  a.download = replaceSystemChar(fileName+fileExtension);
  a.style = "display:none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
