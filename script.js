const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("nav");

if(menuBtn&&nav){
  menuBtn.addEventListener("click",()=>nav.classList.toggle("open"));
}

const reveals=document.querySelectorAll(".reveal");
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
    }
  });
},{threshold:0.15});

reveals.forEach(el=>observer.observe(el));

function copyMail(mail){
  navigator.clipboard.writeText(mail).then(()=>{
    const status=document.getElementById("copyStatus");
    if(status){
      status.textContent="E-Mail wurde kopiert.";
      setTimeout(()=>status.textContent="",2500);
    }
  });
}