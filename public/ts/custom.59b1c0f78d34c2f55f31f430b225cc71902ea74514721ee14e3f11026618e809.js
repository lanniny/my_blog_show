(() => {
  // <stdin>
  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.altKey && e.key === "a") {
        e.preventDefault();
        if (window.Stack && window.Stack.showLogin) {
          window.Stack.showLogin();
        }
      }
      if (e.ctrlKey && e.altKey && e.key === "l") {
        e.preventDefault();
        if (window.Stack && window.Stack.logout) {
          window.Stack.logout();
        }
      }
    });
  });
})();
/*!
*   Hugo Theme Stack - Custom Admin Extensions
*
*   @author: Emma (Product Manager)
*   @project: Hugo Blog Admin System
*   @description: Additional admin functionality and utilities
*/
