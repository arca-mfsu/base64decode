function Main(){
  throw new Error("This is a static class");
}

Main.initialize = function(){
  //get document elements
  this.textarea = document.getElementById("textarea");
  this.buttonTop = document.getElementById("buttonTop");
  this.buttonBottom = document.getElementById("buttonBottom");

  //calculate base64 decode
  this.resultBase64 = decodeURIComponent(window.location.hash.substring(1));
  this.resultBinary = "";

  //upload filename
  this.resultName = "";
  this.resultExtension = "";

  //checkException
  this.exceptionMessage = this.checkException();
  this.initializeCache();

  //run
  if(this.exceptionMessage){
    this.showDefault();
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
    return "여기에 문자를 입력하거나 붙여넣기 또는 파일을 업로드해주세요...";
  }
  try{atob(this.resultBase64)}catch(e){
    return "base64인코딩에 실패했습니다. 여기에 문자를 입력하거나 붙여넣기 또는 파일을 업로드해주세요...";
  }
  return "";
}

Main.showDefault = function(){
  this.textarea.value = "";
  this.textarea.readOnly = false;
  this.textarea.placeholder = this.exceptionMessage;
  this.textarea.style = "";
  this.topButton.innerText = "업로드";
  this.topButton.onclick = this.Upload.bind(this);
  this.topButton.style = "";
  this.bottomButton.innerText = "인코드";
  this.bottomButton.onclick = this.Encode.bind(this);
  this.bottomButton.style = "";
}

Main.showResult = function(){
  this.textarea.value = "";
  this.textarea.readOnly = true;
  this.textarea.placeholder = "";
  this.textarea.style = "";
  this.topButton.innerText = "복사";
  this.topButton.onclick = this.Copy.bind(this);
  this.topButton.style = "";
  this.bottomButton.innerText = "다시하기";
  this.bottomButton.onclick = this.Retry.bind(this);
  this.bottomButton.style = "";
}

Main.Upload = function(){
}

Main.Encode = function(){
}

Main.Copy = function(){
}

Main.Retry = function(){
}
