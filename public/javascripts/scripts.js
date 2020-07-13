function hideUnhide(divName, selfDiv) {
  var x = document.getElementById(divName);
  var y = document.getElementById(selfDiv);
  if (x.style.display === "none" || x.style.display === "") {
    x.style.display = "block";
    y.innerHTML = "hide";
  } else {
    x.style.display = "none";
    y.innerHTML = "edit";
  }
}
