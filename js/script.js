"use strict";

const navs = document.querySelectorAll("header nav ul"); // both navs
const footerLinks = document.querySelector("footer ul");
const operationButtonsContainer = document.querySelector(".operations");
const operationsButtons = document.querySelectorAll(".operations button");
const contents = document.querySelectorAll(".operation-content .content");
const navLinks = document.querySelectorAll("#top nav a");
const navUl = document.querySelector("#top ul");
const compLoginBtn = document.querySelector("#top ul button");
const logoLink = document.querySelector("#top a[href='#top']");
const compNav = document.querySelector("#top nav");
const phoneNav = document.querySelector("#top2");
const header = document.querySelector("#top");
const sections = document.querySelectorAll("section");
const imgs = document.querySelectorAll(".feature img");
const slider = document.querySelector("main #testimonials .slider");
const slides = [...document.querySelectorAll("main #testimonials .slide")];
const leftBtn = document.querySelector("main .buttons button:first-child");
const rightBtn = document.querySelector("main .buttons button:last-child");
const dotsContainer = document.querySelector("main #testimonials .dots");
let dots;

const setOpacity = function (opacity) {
  navLinks.forEach((link) => {
    link.style.opacity = opacity;
  });
};

const displayNav = function (entries) {
  const [entry] = entries;
  const nav = this;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const getTop = function (e) {
  e.preventDefault();
  document.querySelector("#top").scrollIntoView({ behavior: "smooth" });
};

// computer nav
const compNavObserver = new IntersectionObserver(displayNav.bind(compNav), {
  root: null,
  threshold: 0,
  rootMargin: `-96px`,
});

compNavObserver.observe(header);

// phone nav
const phoneNavObserver = new IntersectionObserver(displayNav.bind(phoneNav), {
  root: null,
  threshold: 0,
  rootMargin: `-96px`,
});

phoneNavObserver.observe(header);

// reveal sections

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section-hidden");
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null, // viewport
  threshold: 0.15,
});
sections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section-hidden");
});

// lazy loading

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null, // viewport
  threshold: 0,
});
imgs.forEach((img) => imgObserver.observe(img));

// tab component
operationButtonsContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("operations")) {
    operationsButtons.forEach((button) => {
      // remove active from the active button
      if (button.dataset.tab !== e.target.dataset.tab)
        button.classList.remove("active-tab");
    });
    contents.forEach((content) => {
      if (content.dataset.content === e.target.dataset.tab)
        content.classList.add("active-content");
      else content.classList.remove("active-content");
    });
    e.target.classList.add("active-tab");
  }
});

// scrolling for both navs
navs.forEach((nav) =>
  nav.addEventListener("click", (e) => {
    if (e.target.hasAttribute("href") && e.target.getAttribute("href") !== "./login/index.html") {
      e.preventDefault();
      const href = e.target.getAttribute("href");
      document.querySelector(href).scrollIntoView({ behavior: "smooth" });
    }
  })
);

footerLinks.addEventListener("click", (e) => {
  e.preventDefault();
});

logoLink.addEventListener("click", getTop);

document
  .querySelector('footer a[href="#top"]')
  .addEventListener("click", getTop);

document
  .querySelector('#top2 a[href="#top"]')
  .addEventListener("click", getTop);

// menu click event
document.querySelector(".menuBtn").addEventListener("click", function () {
  this.classList.toggle("act");

  if (this.classList.contains("act")) {
    document.querySelector(".mainMenu").classList.add("act");
  } else {
    document.querySelector(".mainMenu").classList.remove("act");
  }
});

document.querySelectorAll(".mainMenu li").forEach((li) =>
  li.addEventListener("click", function () {
    document.querySelector(".menuBtn").classList.remove("act");

    document.querySelector(".mainMenu").classList.remove("act");
  })
);

document
  .querySelector("header .hero button") // the button
  .addEventListener("click", () =>
    document
      .querySelector("#features") // the section I want to scroll to
      .scrollIntoView({ behavior: "smooth" })
  );

navUl.addEventListener("mouseover", (e) => {
  e.preventDefault();
  if (e.target.hasAttribute("href")) {
    navLinks.forEach((link) => {
      if (link.getAttribute("href") !== e.target.getAttribute("href"))
        link.style.opacity = 0.5;
    });
    compLoginBtn.style.opacity = 0.5;
  }
});

navUl.addEventListener("mouseout", (e) => {
  e.preventDefault();
  setOpacity(1);
  compLoginBtn.style.opacity = 1;
});

compLoginBtn.addEventListener("mouseover", (e) => {
  e.preventDefault();
  setOpacity(0.5);
});

logoLink.addEventListener("mouseover", (e) => {
  e.preventDefault();
  setOpacity(0.5);
  logoLink.style.opacity = 1;
  compLoginBtn.style.opacity = 0.5;
});

logoLink.addEventListener("mouseout", (e) => {
  e.preventDefault();
  setOpacity(1);
  compLoginBtn.style.opacity = 1;
});

// slider
// get the max height for the child

const maxChildHeight = function () {
  return (
    slides.reduce((max, child) => Math.max(max, child.offsetHeight), 0) + 100
  ); // added 100 for the qoute mark
};

// the slider part
const goToSlide = function (currentSlide) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
  });
};

// at the begining
goToSlide(0);

let currentSlide = 0; // the slide displayed
const makeDots = function () {
  slides.forEach((_, i) =>
    dotsContainer.insertAdjacentHTML(
      "beforeEnd",
      `<button class="dot" data-slide="${i}"></button`
    )
  );
  dots = [...document.querySelectorAll("main #testimonials .dot")];
};
makeDots();

const activateDot = function (dotClicked) {
  dots.forEach((dot) => dot.classList.remove("dot-active"));
  dotClicked.classList.add("dot-active");
};

activateDot(dots[0]);

const nextSlide = function () {
  if (currentSlide === slides.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
  activateDot(dots[currentSlide]);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide--;
  }

  goToSlide(currentSlide);
  activateDot(dots[currentSlide]);
};

rightBtn.addEventListener("click", nextSlide);
leftBtn.addEventListener("click", previousSlide);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    nextSlide();
  } else if (e.key === "ArrowLeft") {
    previousSlide();
  }
});

dotsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("dot")) {
    goToSlide(e.target.dataset.slide);
    activateDot(e.target);
  }
});

// responsive for slider
window.addEventListener("load", function () {
  // Set the slider's height based on the child's offsetHeight
  slider.style.height = maxChildHeight() + "px";
});

window.addEventListener("resize", function () {
  // Adjust the slider's height again on window resize
  slider.style.height = maxChildHeight() + "px";
});
