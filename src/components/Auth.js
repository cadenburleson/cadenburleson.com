import { supabase } from '../main.js';

// Render the login form
export function renderLoginForm() {
    const loginContainer = document.createElement('div');
    loginContainer.className = 'login-container';
    loginContainer.innerHTML = `
    <div class="login-card">
      <h2>Admin Login</h2>
      <form id="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <div class="form-message" id="login-message"></div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <div class="auth-links">
        <a href="#" id="show-signup">Need an account? Sign up</a>
      </div>
    </div>
  `;

    // Add event listener for form submission
    const form = loginContainer.querySelector('#login-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.email.value;
        const password = form.password.value;
        const messageEl = document.getElementById('login-message');

        messageEl.textContent = 'Logging in...';
        messageEl.className = 'form-message info';

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw error;
            }

            // Successfully logged in
            messageEl.textContent = 'Login successful!';
            messageEl.className = 'form-message success';

            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = '/admin';
            }, 1000);

        } catch (error) {
            console.error('Error logging in:', error);
            messageEl.textContent = error.message || 'Failed to login. Please try again.';
            messageEl.className = 'form-message error';
        }
    });

    // Add event listener for signup link
    const signupLink = loginContainer.querySelector('#show-signup');
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        const container = loginContainer.parentNode;
        container.innerHTML = '';
        container.appendChild(renderSignupForm());
    });

    return loginContainer;
}

// Render the signup form
export function renderSignupForm() {
    const signupContainer = document.createElement('div');
    signupContainer.className = 'login-container';
    signupContainer.innerHTML = `
    <div class="login-card">
      <h2>Sign Up</h2>
      <form id="signup-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required minlength="6">
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" name="confirm-password" required minlength="6">
        </div>
        <div class="form-message" id="signup-message"></div>
        <button type="submit" class="btn btn-primary">Sign Up</button>
      </form>
      <div class="auth-links">
        <a href="#" id="show-login">Already have an account? Log in</a>
      </div>
    </div>
  `;

    // Add event listener for form submission
    const form = signupContainer.querySelector('#signup-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form['confirm-password'].value;
        const messageEl = document.getElementById('signup-message');

        // Check if passwords match
        if (password !== confirmPassword) {
            messageEl.textContent = 'Passwords do not match.';
            messageEl.className = 'form-message error';
            return;
        }

        messageEl.textContent = 'Creating account...';
        messageEl.className = 'form-message info';

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) {
                throw error;
            }

            messageEl.textContent = 'Account created successfully! Please check your email for confirmation.';
            messageEl.className = 'form-message success';

            // Show login form after successful signup
            setTimeout(() => {
                const container = signupContainer.parentNode;
                container.innerHTML = '';
                container.appendChild(renderLoginForm());
            }, 3000);

        } catch (error) {
            console.error('Error signing up:', error);
            messageEl.textContent = error.message || 'Failed to create account. Please try again.';
            messageEl.className = 'form-message error';
        }
    });

    // Add event listener for login link
    const loginLink = signupContainer.querySelector('#show-login');
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        const container = signupContainer.parentNode;
        container.innerHTML = '';
        container.appendChild(renderLoginForm());
    });

    return signupContainer;
}

// Check if user is authenticated
export async function isAuthenticated() {
    try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error checking auth status:', error);
            return false;
        }

        return data.session !== null;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return false;
    }
}

// Sign out user
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error signing out:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error signing out:', error);
        return false;
    }
} 