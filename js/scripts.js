import config from './config.js';
import { FormHandler } from './formHandler.js';

document.addEventListener('DOMContentLoaded', () => {

    emailjs.init(config.emailjs.publicKey);

    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        delay: 100,
        easing: 'ease-in-out',
        anchorPlacement: 'top-bottom',
    });

    const hamburger = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    try {
        new FormHandler('.contact-form');
    } catch (error) {
        console.error('Error initializing FormHandler:', error);
    }
});


window.addEventListener('resize', () => {
    AOS.refresh();
});