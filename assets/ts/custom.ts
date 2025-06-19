/*!
*   Hugo Theme Stack - Custom Admin Extensions
*
*   @author: Emma (Product Manager)
*   @project: Hugo Blog Admin System
*   @description: Additional admin functionality and utilities
*/

// This file can be used for additional custom functionality
// The main authentication system is integrated in main.ts

// Example: Add keyboard shortcuts for admin functions
document.addEventListener('DOMContentLoaded', () => {
    // Ctrl+Alt+A to show admin login
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            e.preventDefault();
            if (window.Stack && window.Stack.showLogin) {
                window.Stack.showLogin();
            }
        }
        
        // Ctrl+Alt+L to logout
        if (e.ctrlKey && e.altKey && e.key === 'l') {
            e.preventDefault();
            if (window.Stack && window.Stack.logout) {
                window.Stack.logout();
            }
        }
    });
});

// Export for potential future use
export {};
