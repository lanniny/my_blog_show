/*!
*   Hugo Theme Stack - Extended with Admin Authentication
*
*   @author: Jimmy Cai (Original), Emma (Admin Extension)
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
import StackGallery from "ts/gallery";
import { getColor } from 'ts/color';
import menu from 'ts/menu';
import createElement from 'ts/createElement';
import StackColorScheme from 'ts/colorScheme';
import { setupScrollspy } from 'ts/scrollspy';
import { setupSmoothAnchors } from "ts/smoothAnchors";
import StackAuth, { AuthUtils } from 'ts/auth';

// Global auth instance
let globalAuth: StackAuth;

let Stack = {
    init: () => {
        /**
         * Initialize authentication system
         */
        globalAuth = new StackAuth();
        
        // Listen for auth status changes
        window.addEventListener('onAuthStatusChange', (e: CustomEvent) => {
            const { status, isAuthenticated, isAdmin, remainingAttempts } = e.detail;
            
            // Update UI based on auth status
            AuthUtils.toggleAdminElements(isAdmin);
            AuthUtils.updateBodyClass(isAdmin);
            
            // Handle different auth events
            switch (status) {
                case 'authenticated':
                    AuthUtils.hideLoginModal();
                    console.log('Admin authenticated successfully');
                    break;
                case 'failed':
                    AuthUtils.showLoginError('密码错误');
                    if (remainingAttempts > 0) {
                        AuthUtils.showAttemptsInfo(remainingAttempts);
                    }
                    break;
                case 'blocked':
                    AuthUtils.showLoginError('登录尝试次数过多，请稍后再试');
                    break;
                case 'guest':
                    console.log('User logged out or session expired');
                    break;
            }
        });

        // Create and inject login modal with delay to ensure DOM is ready
        setTimeout(() => {
            const modalHTML = AuthUtils.createLoginModal();
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Bind login modal events
            Stack.bindAuthEvents();

            // Initialize admin state on page load
            const isAdmin = globalAuth.isAuthenticated();
            AuthUtils.toggleAdminElements(isAdmin);
            AuthUtils.updateBodyClass(isAdmin);
        }, 100);

        /**
         * Bind menu event
         */
        menu();

        const articleContent = document.querySelector('.article-content') as HTMLElement;
        if (articleContent) {
            new StackGallery(articleContent);
            setupSmoothAnchors();
            setupScrollspy();
        }

        /**
         * Add linear gradient background to tile style article
         */
        const articleTile = document.querySelector('.article-list--tile');
        if (articleTile) {
            let observer = new IntersectionObserver(async (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);

                    const articles = entry.target.querySelectorAll('article.has-image');
                    articles.forEach(async articles => {
                        const image = articles.querySelector('img'),
                            imageURL = image.src,
                            key = image.getAttribute('data-key'),
                            hash = image.getAttribute('data-hash'),
                            articleDetails: HTMLDivElement = articles.querySelector('.article-details');

                        const colors = await getColor(key, hash, imageURL);

                        articleDetails.style.background = `
                        linear-gradient(0deg, 
                            rgba(${colors.DarkMuted.rgb[0]}, ${colors.DarkMuted.rgb[1]}, ${colors.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${colors.Vibrant.rgb[0]}, ${colors.Vibrant.rgb[1]}, ${colors.Vibrant.rgb[2]}, 0.75) 100%)`;
                    })
                })
            });

            observer.observe(articleTile)
        }

        /**
         * Add copy button to code block
        */
        const highlights = document.querySelectorAll('.article-content div.highlight');
        const copyText = `Copy`,
            copiedText = `Copied!`;

        highlights.forEach(highlight => {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = copyText;
            copyButton.classList.add('copyCodeButton');
            highlight.appendChild(copyButton);

            const codeBlock = highlight.querySelector('code[data-lang]');
            if (!codeBlock) return;

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeBlock.textContent)
                    .then(() => {
                        copyButton.textContent = copiedText;

                        setTimeout(() => {
                            copyButton.textContent = copyText;
                        }, 1000);
                    })
                    .catch(err => {
                        alert(err)
                        console.log('Something went wrong', err);
                    });
            });
        });

        new StackColorScheme(document.getElementById('dark-mode-toggle'));
    },

    /**
     * Bind authentication related events
     */
    bindAuthEvents: () => {
        // Login form submission
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const passwordInput = document.getElementById('admin-password') as HTMLInputElement;
                if (passwordInput) {
                    globalAuth.authenticate(passwordInput.value);
                }
            });
        }

        // Modal close events
        const closeBtn = document.getElementById('admin-modal-close');
        const cancelBtn = document.getElementById('admin-cancel-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                AuthUtils.hideLoginModal();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                AuthUtils.hideLoginModal();
            });
        }

        // Close modal when clicking outside
        const modal = document.getElementById('admin-login-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    AuthUtils.hideLoginModal();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                AuthUtils.hideLoginModal();
            }
        });

        // Admin panel toggle
        const adminPanelToggle = document.getElementById('admin-panel-toggle');
        if (adminPanelToggle) {
            adminPanelToggle.addEventListener('click', (e) => {
                e.preventDefault();
                // TODO: Implement admin panel functionality in future tasks
                console.log('Admin panel toggle clicked - functionality to be implemented');
            });
        }
    },

    /**
     * Get global auth instance
     */
    getAuth: () => {
        return globalAuth;
    },

    /**
     * Show admin login modal
     */
    showLogin: () => {
        AuthUtils.showLoginModal();
    },

    /**
     * Admin logout
     */
    logout: () => {
        if (globalAuth) {
            globalAuth.logout();
        }
    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        Stack.init();
    }, 0);
})

declare global {
    interface Window {
        createElement: any;
        Stack: any;
        StackAuth: any;
    }
}

window.Stack = Stack;
window.createElement = createElement;
window.StackAuth = globalAuth;
