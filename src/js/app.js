import * as flsFunctions from "./modules/functions.js";
import Swiper from 'swiper';
import mixitup from 'mixitup';

flsFunctions.isWebp();



document.addEventListener("DOMContentLoaded", function() {
  const swiper = new Swiper('.swiper', {
    loop: false,
    enabled: false,
  });

  const containerEl = document.querySelector('.images__container');

  const mixer = mixitup(containerEl);
});


