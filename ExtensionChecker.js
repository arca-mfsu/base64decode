//코드 제작 우선순위 : 최하위
//현재는 ExtensionChecker제작 및 관련 기능에 무게를 실지 않습니다.

function ExtensionChecker(){
}

ExtensionChecker.getExtension = function(binary){
  if(binary.slice(0,4) === "\x50\x4B\x03\x04")
    return ".zip";
  if(binary.slice(0,3) === "\xFF\xD8\xFF")
    return ".jpg";
  if(binary.slice(0,8) === "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A")
    return ".png";
  if(binary.slice(0,3) === "\x47\x49\x46")
    return ".gif";
  
  return ".txt";
}
