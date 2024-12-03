// Get the button
export function setupButtonClick(){
  const backToTopBtn = document.getElementById("backToTopBtn");

  // Show the button when scrolled down 100px from the top
  window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  };

  // Scroll to the top when the button is clicked
  backToTopBtn.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
} 