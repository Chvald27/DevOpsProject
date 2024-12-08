document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.querySelector("form");
    const usernameField = document.querySelector("input[name='username']");
    const emailField = document.querySelector("input[name='email']");
    const passwordField = document.querySelector("input[name='password']");
    const confirmPasswordField = document.querySelector("input[name='confirm_password']");
    const submitButton = document.querySelector("button[type='submit']");

    // Helper function to show error messages
    function showError(field, message) {
        let errorContainer = field.nextElementSibling;
        if (!errorContainer || !errorContainer.classList.contains("text-danger")) {
            errorContainer = document.createElement("div");
            errorContainer.classList.add("text-danger");
            field.parentNode.appendChild(errorContainer);
        }
        errorContainer.textContent = message;
    }

    // Helper function to clear error messages
    function clearError(field) {
        const errorContainer = field.nextElementSibling;
        if (errorContainer && errorContainer.classList.contains("text-danger")) {
            errorContainer.textContent = "";
        }
    }

    // Validate username
    usernameField.addEventListener("input", function () {
        const value = usernameField.value.trim();
        if (value.length < 3 || value.length > 50) {
            showError(usernameField, "Username must be between 3 and 50 characters.");
        } else {
            clearError(usernameField);
        }
    });

    // Validate email
    emailField.addEventListener("input", function () {
        const value = emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(emailField, "Please enter a valid email address.");
        } else {
            clearError(emailField);
        }
    });

    // Validate password
    passwordField.addEventListener("input", function () {
        const value = passwordField.value.trim();
        if (value.length < 8) {
            showError(passwordField, "Password must be at least 8 characters long.");
        } else {
            clearError(passwordField);
        }
    });

    // Validate confirm password
    confirmPasswordField.addEventListener("input", function () {
        const passwordValue = passwordField.value.trim();
        const confirmPasswordValue = confirmPasswordField.value.trim();
        if (passwordValue !== confirmPasswordValue) {
            showError(confirmPasswordField, "Passwords do not match.");
        } else {
            clearError(confirmPasswordField);
        }
    });

    // Prevent form submission if validation fails
    signupForm.addEventListener("submit", function (e) {
        let isValid = true;

        // Validate username
        const usernameValue = usernameField.value.trim();
        if (usernameValue.length < 3 || usernameValue.length > 50) {
            showError(usernameField, "Username must be between 3 and 50 characters.");
            isValid = false;
        }

        // Validate email
        const emailValue = emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            showError(emailField, "Please enter a valid email address.");
            isValid = false;
        }

        // Validate password
        const passwordValue = passwordField.value.trim();
        if (passwordValue.length < 8) {
            showError(passwordField, "Password must be at least 8 characters long.");
            isValid = false;
        }

        // Validate confirm password
        const confirmPasswordValue = confirmPasswordField.value.trim();
        if (passwordValue !== confirmPasswordValue) {
            showError(confirmPasswordField, "Passwords do not match.");
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault(); // Prevent form submission
        }
    });
});
