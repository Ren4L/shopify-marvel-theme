document.querySelectorAll('.nav--element').forEach((el)=>{
   el.addEventListener('click', Scroll);
});

function Scroll(e){
    document.querySelector('#'+e.target.classList[1]).scrollIntoView({ behavior: "smooth" });
}