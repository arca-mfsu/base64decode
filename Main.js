function Main(){
  throw new Error("This is a static class");
}

Main.initialize = function(){
  //get document elements
  this.textarea = document.getElementById("textarea");
  this.button = document.getElementById("button");
  this.input = document.getElementById("input");

  //calculate base64 decode
  this.resultBase64 = decodeURIComponent(window.location.hash.substring(1));
  this.resultBinary = "";

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
  if(!this.resultBase64){
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
  this.textarea.placeholder = this.exceptionMessage;
  this.textarea.style = "";
  this.input.value = "";
  this.input.placeholder = "";
  this.input.style = "display:none";
  this.button.innerText = "디코드";
  this.button.onclick = this.Decode.bind(this);
  this.button.style = "";
}

Main.showResult = function(){
  this.textarea.value = "";
  this.textarea.readOnly = true;
  this.textarea.placeholder = "";
  this.textarea.style = "display:none";
  this.input.value = "";
  this.input.placeholder = "";
  this.input.style = "";
  this.button.innerText = "다운로드";
  this.button.onclick = this.Download.bind(this);
  this.button.style = "";

  this.calcResult();
}

Main.calcResult = function(){
  this.resultBinary = atob(this.resultBase64);
  this.resultExtension = ExtensionChecker.getExtension(this.resultBinary);
  this.resultName = decodeURIComponent(document.location.search.substring(1));
  this.resultName = this.resultName || "result" + this.resultExtension;
  
  this.input.placeholder = this.resultName;
  
  if([".png",".jpg",".gif"].includes(this.resultExtension)){
    this.calcImgResult();
  }else if(".zip" === this.resultExtension){
    this.calcZipResult();
  }else if(".txt" === this.resultExtension){
    this.calcTextResult();
  }
}

Main.calcImgResult = function(){
  this.textarea.style = "";
  const result = Utils.binaryToBlob(this.resultBinary);
  const resultUrlCache = URL.createObjectURL(result);
  this.textarea.style = "background-size: contain; background-repeat: no-repeat; background-image: url("+resultUrlCache+")";
  sessionStorage.setItem("resultUrlCache", resultUrlCache);
}

Main.calcZipResult = function(){
  this.textarea.style = "";
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

Main.calcTextResult = function(){
  this.textarea.style = "";
  this.textarea.value = Utils.binaryToUtf8(this.resultBinary);
  this.disableDownload();
}

Main.disableDownload = function(){
  this.button.style = "display:none";
  this.input.style = "display:none";
}


Main.Decode = function(){
  window.location.hash = "#" + this.textarea.value;
}

Main.Download = function(){
  const result = Utils.binaryToBlob(this.resultBinary);
  const url = URL.createObjectURL(result);
  const fileName = this.input.value || this.input.placeholder || "result";
  const fileExtension = fileName.includes(".") ? "" : this.resultName.includes(".") ? this.resultName.substring(this.resultName.lastIndexOf('.')) : ".txt";
  a = document.createElement("a");
  a.href = url;
  a.download = Utils.replaceSystemChar(fileName + fileExtension);
  a.style = "display:none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
