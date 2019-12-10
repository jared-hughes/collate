export function showPDF(blob, filename="file.pdf") {
  const newBlob = new Blob([blob], {type: "application/pdf"});
  const href = window.URL.createObjectURL(newBlob);
  let link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
  // free resources
  setTimeout(function(){
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(href);
  }, 100);
}
