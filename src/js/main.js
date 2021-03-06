import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// utils and polyfills
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

function on(elementSelector, eventName, handler) {
  document.addEventListener(
    eventName,
    function (e) {
      for (
        var target = e.target;
        target && target != this;
        target = target.parentNode
      ) {
        if (target.matches(elementSelector)) {
          handler.call(target, e);
          break;
        }
      }
    },
    false
  );
}

function debounce(fn, delay) {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay);
  };
}

// faq accordion
on(".faq__item", "click", function (e) {
  for (var el of this.closest(".faq__list").querySelectorAll(
    ".faq__item.js-active"
  )) {
    if (el === this) continue;

    el.classList.remove("js-active");
  }

  this.classList.toggle("js-active");
});

// main menu
on("#main-menu-toggle", "click", function (e) {
  e.preventDefault();

  document.body.classList.toggle("js-show-menu");
});

// modal
on("[data-open-modal]", "click", function (e) {
  e.preventDefault();

  const modalId = this.dataset.openModal;
  const modal = document.getElementById(modalId);
  if (modal) {
    document.body.classList.add("js-show-modal");
    modal.classList.add("js-show");
  }
});

on(".modal-backdrop", "click", function (e) {
  if (e.target === this) {
    this.classList.remove("js-show");
  }

  const openModals = document.querySelectorAll(".modal-backdrop.js-show");
  if (!openModals.length) {
    document.body.classList.remove("js-show-modal");
  }
});

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("js-show");
    const openModals = document.querySelectorAll(".modal-backdrop.js-show");
    if (!openModals.length) {
      document.body.classList.remove("js-show-modal");
    }
  }
}

window.closeModal = closeModal;

// features highlight
var featuresElements = document.querySelectorAll(".promo-features__item");
var FEATURES_HIGHLIGHT_INTERVAL = 5000;
function setActiveFeature(index) {
  for (var el of featuresElements) {
    el.classList.remove("js-active");
  }
  featuresElements[index].classList.add("js-active");
}
if (featuresElements.length) {
  var activeFeatureIndex = 0;
  setActiveFeature(activeFeatureIndex);
  setInterval(function () {
    activeFeatureIndex = (activeFeatureIndex + 1) % featuresElements.length;
    setActiveFeature(activeFeatureIndex);
  }, FEATURES_HIGHLIGHT_INTERVAL);
}

// preloader
let loaded = false;
window.addEventListener("load", (event) => {
  document.body.classList.add("js-loaded");
  loaded = true;

  initAnimations();

  const animateInViewContainers =
    document.querySelectorAll(".js-reveal-scroll");

  animateInViewContainers.forEach(function (container) {
    const io = new IntersectionObserver(
      (entries, options) => {
        entries.forEach((entry) => {
          if (loaded && entry.isIntersecting) {
            container.classList.add("js-show");
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    io.observe(container);
  });

  setTimeout(function () {
    document.getElementById("preloader").remove();
  }, 2000);
});

// scroll animations
function initAnimations() {
  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
      ScrollTrigger.saveStyles(
        "#showcase-1-1, #showcase-1-2, #showcase-1-3, #showcase-1-4, #showcase-1-4-1, #showcase-1-4-2, #showcase-1-4-3, #showcase-1-4-4"
      );
      ScrollTrigger.saveStyles(
        "#showcase-2-1, #showcase-2-2, #showcase-2-3, #showcase-2-4, #showcase-2-4-1, #showcase-2-4-2, #showcase-2-4-3, #showcase-2-4-4"
      );
      ScrollTrigger.saveStyles(
        "#product-showcase-sticky-block, #product-showcase-frame"
      );
      ScrollTrigger.saveStyles(
        ".js-parallax-container, .js-parallax-text, .js-parallax-img"
      );

      const promoFeaturesImg1 = document.getElementById("promo-features-img-1");
      if (promoFeaturesImg1) {
        gsap.to(promoFeaturesImg1, {
          y: 1000,
          x: -80,
          display: "none",
          scrollTrigger: {
            trigger: promoFeaturesImg1,
            start: "bottom bottom",
            endTrigger: ".promo-features__content",
            end: "bottom +=100%",
            pin: true,
            pinSpacing: false,
            scrub: true,
            onUpdate: function (self) {
              if (self.progress >= 1) {
                promoFeaturesImg1.style.display = "none";
              } else {
                promoFeaturesImg1.style.display = "block";
              }
            },
          },
        });
      }

      const promoFeatuesImg3 = document.getElementById("promo-features-img-3");
      if (promoFeatuesImg3) {
        gsap.to(promoFeatuesImg3, {
          y: 1000,
          x: -600,
          scrollTrigger: {
            trigger: promoFeatuesImg3,
            start: "bottom bottom",
            endTrigger: ".promo-features__content",
            end: "bottom +=100%",
            pin: true,
            pinSpacing: false,
            scrub: true,
            onUpdate: function (self) {
              if (self.progress >= 1) {
                promoFeatuesImg3.style.display = "none";
              } else {
                promoFeatuesImg3.style.display = "block";
              }
            },
          },
        });
      }

      const promoFeatuesImg2 = document.getElementById("promo-features-img-2");
      if (promoFeatuesImg2) {
        gsap.to("#promo-features-img-2", {
          scrollTrigger: {
            trigger: promoFeatuesImg2,
            start: "bottom bottom",
            endTrigger: ".promo-features__content",
            end: "bottom bottom",
            pin: true,
            scrub: true,
            onUpdate: function (self) {
              const frame = Math.floor(self.progress * 5);
              promoFeatuesImg2.style.backgroundPosition = `-${
                frame * 120
              }px center`;
            },
          },
        });
      }

      const promoFeatuesImg4 = document.getElementById("promo-features-img-4");
      if (promoFeatuesImg4) {
        gsap.to("#promo-features-img-4", {
          scrollTrigger: {
            trigger: promoFeatuesImg4,
            start: "bottom bottom",
            endTrigger: ".promo-features__content",
            end: "bottom bottom",
            pin: true,
            scrub: true,
            onUpdate: function (self) {
              const frame = Math.floor(self.progress * 5);
              promoFeatuesImg4.style.backgroundPosition = `-${
                frame * 120
              }px center`;
            },
          },
        });
      }

      const productShowcaseFrame = document.getElementById(
        "product-showcase-frame"
      );
      if (productShowcaseFrame) {
        const showcaseTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: productShowcaseFrame,
            start: "top center",
            endTrigger: productShowcaseFrame,
            end: "bottom center",
            scrub: true,
          },
        });

        showcaseTimeline.from("#showcase-1-1", { y: 200, duration: 1 }, 0);
        showcaseTimeline.to("#showcase-1-1", { y: 200, duration: 1 }, 2);

        showcaseTimeline.from("#showcase-1-2", { opacity: 0, duration: 1 }, 0);
        showcaseTimeline.to("#showcase-1-2", { opacity: 0, duration: 1 }, 2);

        showcaseTimeline.from("#showcase-1-3", { opacity: 0, duration: 1 }, 0);
        showcaseTimeline.to("#showcase-1-3", { opacity: 0, duration: 1 }, 2);

        showcaseTimeline.from("#showcase-1-4", { opacity: 0, duration: 1 }, 0);
        showcaseTimeline.to("#showcase-1-4", { opacity: 0, duration: 1 }, 2);

        showcaseTimeline.from(
          "#showcase-1-4-1",
          { y: 700, x: -100, duration: 0.5 },
          0
        );

        showcaseTimeline.from(
          "#showcase-1-4-2",
          { y: 700, x: -100, duration: 0.2 },
          0 + 0.5
        );

        showcaseTimeline.from(
          "#showcase-1-4-3",
          { y: 700, x: -350, duration: 0.5 },
          0 + 0.3
        );

        showcaseTimeline.from(
          "#showcase-1-4-4",
          { y: 700, x: -350, duration: 0.2 },
          0 + 0.6
        );

        showcaseTimeline.to(
          "#showcase-1-4-1, #showcase-1-4-2",
          { rotation: -90, y: 400, x: -200, duration: 0.5 },
          1.9
        );

        showcaseTimeline.to(
          "#showcase-1-4-3, #showcase-1-4-4",
          { rotation: 90, y: 400, x: 200, duration: 0.5 },
          1.9
        );

        //

        showcaseTimeline.from("#showcase-2-1", { y: 200, duration: 1 }, 2.5);

        showcaseTimeline.from("#showcase-2-2", { opacity: 0, duration: 1 }, 3);

        showcaseTimeline.from("#showcase-2-3", { opacity: 0, duration: 1 }, 3);

        showcaseTimeline.from("#showcase-2-4", { opacity: 0, duration: 1 }, 3);

        showcaseTimeline.from(
          "#showcase-2-4-1",
          { y: 700, x: -100, duration: 0.5 },
          3
        );

        showcaseTimeline.from(
          "#showcase-2-4-2",
          { y: 700, x: -100, duration: 0.2 },
          3 + 0.5
        );

        showcaseTimeline.from(
          "#showcase-2-4-3",
          { y: 700, x: -350, duration: 0.5 },
          3 + 0.3
        );

        showcaseTimeline.from(
          "#showcase-2-4-4",
          { y: 700, x: -350, duration: 0.2 },
          3 + 0.6
        );

        showcaseTimeline.to(
          "#showcase-2-4-1, #showcase-2-4-2",
          { rotation: -90, y: 400, x: -200, duration: 0.5 },
          4 + 0.9
        );

        showcaseTimeline.to(
          "#showcase-2-4-3, #showcase-2-4-4",
          { rotation: 90, y: 400, x: 200, duration: 0.5 },
          4 + 0.9
        );

        gsap.to("#product-showcase-sticky-block", {
          scrollTrigger: {
            trigger: "#product-showcase-frame",
            start: "top top",
            endTrigger: "#product-showcase-frame",
            end: "bottom bottom",
            scrub: true,
            pin: true,
            pinSpacing: false,
          },
        });
      }

      const parallaxContainers = document.querySelectorAll(
        ".js-parallax-container"
      );

      parallaxContainers.forEach((container) => {
        const text = container.querySelector(".js-parallax-text");
        if (text) {
          gsap.from(text, {
            yPercent: 40,
            scrollTrigger: {
              trigger: container,
              scrub: true,
            },
          });
        }
        const img = container.querySelectorAll(".js-parallax-img");
        if (img) {
          gsap.from(img, {
            backgroundPosition: "50% -150px",
            scrollTrigger: {
              trigger: container,
              scrub: true,
            },
          });
        }
      });
    },
    all: function () {
      ScrollTrigger.saveStyles(".js-reveal-text-1, js-reveal-text-2");

      const textReveal1Elements =
        document.querySelectorAll(".js-reveal-text-1");
      textReveal1Elements.forEach((el) => {
        gsap.from(el, {
          rotation: "3deg",
          opacity: 0,
          duration: 0.5,
          ease: "ease-in",
          y: 50,
          scrollTrigger: {
            trigger: el,
            toggleClass: "js-active",
            once: true,
          },
        });
      });

      const textReveal2Elements =
        document.querySelectorAll(".js-reveal-text-2");
      textReveal2Elements.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          duration: 0.5,
          ease: "ease-in",
          y: 50,
          stagger: 0.5,
          scrollTrigger: {
            trigger: el,
            once: true,
          },
        });
      });
    },
  });
}

const refreshScrollTrigger = debounce(function () {
  ScrollTrigger.refresh(true);
}, 100);

window.addEventListener("resize", refreshScrollTrigger);
