/**
 * Enhanced Desktop Authentication System
 * Provides additional security features for the desktop application
 */

class DesktopAuth {
    constructor() {
        this.isDesktop = typeof window !== 'undefined' && window.electronAPI;
        this.maxAttempts = 3;
        this.lockoutDuration = 5 * 60 * 1000; // 5 minutes
        this.attemptKey = 'poultryAppAttempts';
        this.lockoutKey = 'poultryAppLockout';
    }

    init() {
        if (!this.isDesktop) return;
        
        // Wait for auth to be ready before enhancing
        if (window.auth && typeof window.auth.showLoginScreen === 'function') {
            this.enhanceDesktopSecurity();
        } else {
            // Retry after a brief delay
            setTimeout(() => this.init(), 100);
        }
    }

    enhanceDesktopSecurity() {
        // Add desktop-specific security features
        this.addAutoLock();
        this.enhanceLoginScreen();
    }

    checkLockout() {
        const lockoutData = localStorage.getItem(this.lockoutKey);
        if (lockoutData) {
            const lockout = JSON.parse(lockoutData);
            const now = new Date().getTime();
            
            if (now < lockout.until) {
                const remaining = Math.ceil((lockout.until - now) / 1000 / 60);
                return { 
                    locked: true, 
                    remaining: remaining 
                };
            } else {
                // Lockout expired, clear it
                localStorage.removeItem(this.lockoutKey);
                localStorage.removeItem(this.attemptKey);
            }
        }
        return { locked: false };
    }

    recordFailedAttempt() {
        if (!this.isDesktop) return false;
        
        const attempts = this.getAttempts() + 1;
        localStorage.setItem(this.attemptKey, attempts.toString());
        
        if (attempts >= this.maxAttempts) {
            // Lock out for 5 minutes
            const lockoutUntil = new Date().getTime() + this.lockoutDuration;
            localStorage.setItem(this.lockoutKey, JSON.stringify({ 
                until: lockoutUntil,
                attempts: attempts 
            }));
            return true; // Account is now locked
        }
        return false;
    }

    getAttempts() {
        const attempts = localStorage.getItem(this.attemptKey);
        return attempts ? parseInt(attempts) : 0;
    }

    clearAttempts() {
        localStorage.removeItem(this.attemptKey);
        localStorage.removeItem(this.lockoutKey);
    }

    addAutoLock() {
        // Auto-lock after 30 minutes of inactivity on desktop
        let inactivityTimer;
        const inactivityDuration = 30 * 60 * 1000; // 30 minutes

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (window.auth && window.auth.isAuthenticated) {
                    window.auth.logout();
                    alert('Session expired due to inactivity. Please log in again.');
                    window.location.reload();
                }
            }, inactivityDuration);
        };

        // Track user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });

        resetTimer();
    }

    enhanceLoginScreen() {
        // Add desktop-specific enhancements to login
        if (!window.auth || typeof window.auth.showLoginScreen !== 'function') {
            console.warn('Auth system not ready for enhancement');
            return;
        }
        
        // Don't override if already enhanced
        if (window.auth._desktopEnhanced) {
            return;
        }
        
        const originalShowLoginScreen = window.auth.showLoginScreen.bind(window.auth);
        
        window.auth.showLoginScreen = () => {
            const lockoutStatus = this.checkLockout();
            
            if (lockoutStatus.locked) {
                return new Promise((resolve) => {
                    const lockoutHTML = `
                        <div class="login-container">
                            <div class="login-card">
                                <div class="login-header">
                                    <i class="fas fa-lock text-danger login-icon"></i>
                                    <h2 class="text-danger">Account Temporarily Locked</h2>
                                    <p class="text-muted">Too many failed login attempts.</p>
                                    <p class="text-warning">Please wait ${lockoutStatus.remaining} minute(s) before trying again.</p>
                                </div>
                                <div class="login-form">
                                    <button class="btn btn-secondary w-100" onclick="window.location.reload()">
                                        <i class="fas fa-sync me-2"></i>Refresh to Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    document.body.innerHTML = lockoutHTML;
                });
            }

            // Show enhanced login with attempt counter
            return new Promise((resolve) => {
                const attempts = this.getAttempts();
                const remainingAttempts = this.maxAttempts - attempts;
                
                const loginHTML = `
                    <div class="login-container">
                        <div class="login-card">
                            <div class="login-header">
                                <i class="fas fa-egg login-icon"></i>
                                <h2>FarmApp</h2>
                                <p class="text-muted">Desktop Application - Enter password to continue</p>
                                ${attempts > 0 ? `<p class="text-warning small">⚠️ ${remainingAttempts} attempt(s) remaining</p>` : ''}
                            </div>
                            <form id="loginForm" class="login-form">
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="fas fa-lock"></i>
                                        </span>
                                        <input type="password" 
                                               id="adminPassword" 
                                               class="form-control" 
                                               placeholder="Admin Password" 
                                               required
                                               autocomplete="current-password">
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">
                                    <i class="fas fa-sign-in-alt me-2"></i>Login
                                </button>
                                <div class="text-center mt-3">
                                    <small class="text-muted">
                                        <i class="fas fa-desktop me-1"></i>Desktop Mode - Extended session
                                    </small>
                                </div>
                            </form>
                        </div>
                    </div>
                `;

                document.body.innerHTML = loginHTML;

                const form = document.getElementById('loginForm');
                const passwordInput = document.getElementById('adminPassword');
                
                // Focus on password input
                passwordInput.focus();
                
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const password = passwordInput.value;
                    
                    if (password === window.auth.adminPassword) {
                        // Successful login
                        this.clearAttempts();
                        window.auth.login(true); // Use the standard login method
                        resolve();
                    } else {
                        // Failed login
                        const isLocked = this.recordFailedAttempt();
                        
                        if (isLocked) {
                            alert('Too many failed attempts. Account locked for 5 minutes.');
                            window.location.reload();
                        } else {
                            const remaining = this.maxAttempts - this.getAttempts();
                            passwordInput.value = '';
                            passwordInput.focus();
                            passwordInput.classList.add('is-invalid');
                            
                            // Show error message
                            const errorMsg = document.createElement('div');
                            errorMsg.className = 'text-danger small mt-2';
                            errorMsg.innerHTML = `❌ Invalid password. ${remaining} attempt(s) remaining.`;
                            form.appendChild(errorMsg);
                            
                            setTimeout(() => {
                                passwordInput.classList.remove('is-invalid');
                                if (errorMsg.parentNode) {
                                    errorMsg.remove();
                                }
                            }, 3000);
                        }
                    }
                });
            });
        };
        
        // Mark as enhanced to prevent re-enhancement
        window.auth._desktopEnhanced = true;
    }
}

// Initialize desktop auth when available
if (typeof window !== 'undefined') {
    window.desktopAuth = new DesktopAuth();
}
