function Utils(){
  throw new Error("This is a static class");
}
Utils.binaryToUtf8 = function(binary){
  const textDecoder = new TextDecoder('utf-8');
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
  }
  return textDecoder.decode(array);
}

Utils.binaryToBlob = function(binary) {
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([ array ]);
  return blob;
};
      

Utils.replaceSystemChar = function(string){
  const replacements = {'/':'／', '\\':'＼', ':':'：', '*':'＊', '"':'゛', '<':'＜', '>':'＞', '|':'｜'};
  return string.replace(/[\/\\:*"<>|]/g, match=>replacements[match]);
}
