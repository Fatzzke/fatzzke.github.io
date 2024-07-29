function importFile(editor) {
  let file = document.querySelector('#file').files[0];
  if (file == null) {
    alert("no file selected");
    return;
  }
  let fileReader = new FileReader();
  fileReader.onload = function (fileLoadedEvent) {
    let textFromFileLoaded = fileLoadedEvent.target.result;
    decrypt(textFromFileLoaded).then((r) => {
      editor.update({ json: r })
    })
  };
  fileReader.readAsText(file)
}

function exportFile(editor){
  encrypt(editor.get().json).then((r) => {
    document.querySelector("#download").href="data:,"+r
    document.querySelector("#download").click();
  })
}

async function decrypt(data) {
  let result;
  let first = atob(data)
  let second = base64ToBytes(first)
  let blob = new Blob([second])
  let ds = new DecompressionStream("gzip");
  let decompressedStream = blob.stream().pipeThrough(ds);
  let response = new Response(decompressedStream).json()
  await response.then((r) => {
    result = r
  })
  return result;
}

async function encrypt(data) {
  let result;
  let inputReadableStream = new Blob([JSON.stringify(data)]).stream()
  let compressedReadableStream = inputReadableStream.pipeThrough(
    new CompressionStream("gzip"),
  );

  let response = new Response(compressedReadableStream).bytes()
  await response.then((r) => {
    let first = bytesToBase64(r)
    result = btoa(first)
  })
  return result;
}

function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}

