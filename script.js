// Main Application Controller
class SmartCartApp {
    constructor() {
        this.currentUser = null;
        this.cart = new ShoppingCart();
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadDashboard();
        this.setupDate();
        this.loadProducts();
        this.setupChatbot();
    }

    checkAuth() {
        const user = StorageUtil.get(STORAGE_KEYS.USER);
        const authScreen = document.getElementById('authScreen');
        const appContainer = document.getElementById('appContainer');

        if (user) {
            this.currentUser = user;
            authScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            this.updateUserInfo();
            this.showToast('Welcome back!', 'success');
        }
    }

    setupEventListeners() {
        // Auth
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('showRegister').addEventListener('click', (e) => this.switchAuthForm(e, 'register'));
        document.getElementById('showLogin').addEventListener('click', (e) => this.switchAuthForm(e, 'login'));

        // Navigation
        document.querySelectorAll('.nav-tab, .mobile-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.switchPage(page);
                this.updateActiveTab(page);
            });
        });

        // Quick Actions
        document.querySelectorAll('.action-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchPage(btn.dataset.page);
            });
        });

        // User Menu
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Cart
        document.getElementById('cartBtn').addEventListener('click', () => this.toggleCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());
        document.querySelector('.close-cart').addEventListener('click', () => this.toggleCart());
        document.getElementById('continueShopping').addEventListener('click', () => this.toggleCart());

        // Notifications
        document.getElementById('notificationBtn').addEventListener('click', () => this.toggleNotifications());

        // Mobile Menu
        document.querySelector('.mobile-menu-btn').addEventListener('click', () => this.toggleMobileMenu());

        // Categories
        document.querySelectorAll('.category').forEach(cat => {
            cat.addEventListener('click', () => {
                document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
                cat.classList.add('active');
                this.filterProducts(cat.dataset.category);
            });
        });

        // Password toggle
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const input = e.target.closest('.password-input').querySelector('input');
                const icon = e.target.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });

        // Add list item
        document.getElementById('addListItem').addEventListener('click', () => {
            this.addShoppingListItem();
        });
    }

    switchAuthForm(e, form) {
        e.preventDefault();
        document.getElementById('loginForm').classList.toggle('hidden', form !== 'login');
        document.getElementById('registerForm').classList.toggle('hidden', form !== 'register');
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Simulate API call
            await this.simulateLoading();
            const user = mockData.users.find(u => u.email === email && u.password === password);

            if (user) {
                const { password, ...userWithoutPassword } = user;
                this.currentUser = userWithoutPassword;
                StorageUtil.set(STORAGE_KEYS.USER, this.currentUser);

                document.getElementById('authScreen').classList.add('hidden');
                document.getElementById('appContainer').classList.remove('hidden');
                this.updateUserInfo();
                this.showToast('Welcome to SmartCart!', 'success');
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            this.showToast(error.message || 'Login failed', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;

        if (password !== confirm) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        try {
            await this.simulateLoading();

            if (mockData.users.some(u => u.email === email)) {
                throw new Error('Email already registered');
            }

            const newUser = {
                id: mockData.users.length + 1,
                name,
                email,
                password,
                preferences: {
                    dietaryRestrictions: [],
                    allergies: [],
                    favoriteCuisines: [],
                    budget: 200
                }
            };

            mockData.users.push(newUser);
            const { password: _, ...userWithoutPassword } = newUser;
            this.currentUser = userWithoutPassword;
            StorageUtil.set(STORAGE_KEYS.USER, this.currentUser);

            document.getElementById('authScreen').classList.add('hidden');
            document.getElementById('appContainer').classList.remove('hidden');
            this.updateUserInfo();
            this.showToast('Account created successfully!', 'success');
            this.switchAuthForm({ preventDefault: () => {} }, 'login');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    logout() {
        StorageUtil.remove(STORAGE_KEYS.USER);
        this.currentUser = null;
        document.getElementById('authScreen').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
        this.showToast('Logged out successfully', 'success');
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userEmail').textContent = this.currentUser.email;
            document.getElementById('greetingName').textContent = this.currentUser.name.split(' ')[0];
        }
    }

    switchPage(page) {
        this.currentPage = page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}Page`)?.classList.add('active');

        // Load page-specific data
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'groceries':
                this.loadProducts();
                break;
            case 'assistant':
                this.setupChatbot();
                break;
            case 'delivery':
                this.loadDelivery();
                break;
            case 'recipes':
                this.loadRecipes();
                break;
        }

        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            document.querySelector('.mobile-menu-btn').classList.remove('active');
            document.querySelector('.nav-center').classList.remove('active');
        }
    }

    updateActiveTab(page) {
        // Update desktop tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.page === page);
        });

        // Update mobile tabs
        document.querySelectorAll('.mobile-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.page === page);
        });
    }

    setupDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    }

    loadDashboard() {
        // Update cart badge
        document.getElementById('cartBadge').textContent = this.cart.getCount();

        // Load expiring items
        const expiringList = document.querySelector('.expiring-list');
        if (expiringList) {
            expiringList.innerHTML = mockData.expiringItems.map(item => `
                <div class="expiring-item">
                    <div class="expiring-icon">
                        <i class="fas fa-${item.icon || 'clock'}"></i>
                    </div>
                    <div class="expiring-details">
                        <h4>${item.name}</h4>
                        <p>Expires in ${item.daysLeft} days</p>
                    </div>
                    <button class="btn btn-sm ${item.daysLeft === 1 ? 'btn-danger' : 'btn-outline'}">
                        Use Now
                    </button>
                </div>
            `).join('');
        }

        // Load recommendations
        const recommendationsGrid = document.querySelector('.recommendations-grid');
        if (recommendationsGrid) {
            recommendationsGrid.innerHTML = mockData.recommendations.map(rec => `
                <div class="recommendation-card">
                    <div class="recommendation-badge ${rec.discount ? 'discount' : ''}">
                        ${rec.discount || 'Best Match'}
                    </div>
                    <div class="recommendation-content">
                        <h3>${rec.name}</h3>
                        <p>${rec.reason}</p>
                        <div class="tags">
                            ${rec.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || ''}
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="app.addToCart(${rec.id})">
                        Add to Cart
                    </button>
                </div>
            `).join('');
        }

        // Load activity
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = mockData.activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon ${activity.type}">
                        <i class="fas fa-${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${activity.message}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    loadProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        productsGrid.innerHTML = mockData.groceries.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <i class="fas fa-${product.icon || 'shopping-basket'}"></i>
                </div>
                <div class="product-content">
                    <div class="product-header">
                        <h3 class="product-title">${product.name}</h3>
                        <span class="product-price">$${product.price}</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <div class="quantity-selector" data-id="${product.id}">
                            <button class="qty-btn minus">-</button>
                            <span class="qty-value">1</span>
                            <button class="qty-btn plus">+</button>
                        </div>
                        <button class="btn btn-primary" onclick="app.addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Setup quantity selectors
        document.querySelectorAll('.quantity-selector').forEach(selector => {
            const minus = selector.querySelector('.minus');
            const plus = selector.querySelector('.plus');
            const value = selector.querySelector('.qty-value');
            let quantity = 1;

            minus.addEventListener('click', () => {
                if (quantity > 1) {
                    quantity--;
                    value.textContent = quantity;
                }
            });

            plus.addEventListener('click', () => {
                quantity++;
                value.textContent = quantity;
            });
        });
    }

    filterProducts(category) {
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    addToCart(productId, quantity = 1) {
        const product = mockData.groceries.find(p => p.id === productId) ||
                       mockData.recommendations.find(r => r.id === productId);
        
        if (product) {
            this.cart.addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
            
            this.updateCartUI();
            this.showToast(`Added ${product.name} to cart`, 'success');
        }
    }

    toggleCart() {
        const cart = document.getElementById('cartSidebar');
        cart.classList.toggle('active');
        if (cart.classList.contains('active')) {
            this.updateCartUI();
        }
    }

    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartBadge = document.getElementById('cartBadge');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTax = document.getElementById('cartTax');
        const cartTotal = document.getElementById('cartTotal');

        // Update badge
        cartBadge.textContent = this.cart.getCount();

        // Update items
        if (this.cart.items.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center p-5">
                    <i class="fas fa-shopping-cart text-gray-400" style="font-size: 3rem;"></i>
                    <p class="text-muted mt-3">Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.cart.items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <i class="fas fa-shopping-basket"></i>
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price} × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                        <div class="cart-quantity">
                            <button class="qty-btn" onclick="app.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="app.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Update totals
        const subtotal = this.cart.getTotal();
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax + 2.99; // + delivery fee

        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTax.textContent = `$${tax.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    updateCartQuantity(itemId, quantity) {
        if (quantity <= 0) {
            this.cart.removeItem(itemId);
        } else {
            this.cart.updateQuantity(itemId, quantity);
        }
        this.updateCartUI();
    }

    checkout() {
        if (this.cart.getCount() === 0) {
            this.showToast('Your cart is empty', 'warning');
            return;
        }

        // Simulate checkout process
        this.showToast('Processing your order...', 'info');
        setTimeout(() => {
            this.cart.clear();
            this.updateCartUI();
            this.toggleCart();
            this.showToast('Order placed successfully!', 'success');
        }, 2000);
    }

    setupChatbot() {
        const chatInput = document.getElementById('chatInput');
        const sendMessageBtn = document.getElementById('sendMessage');
        const clearChatBtn = document.getElementById('clearChat');
        const suggestedQuestions = document.querySelectorAll('.suggested-question');
        const quickActions = document.querySelectorAll('.quick-action');

        // Send message
        sendMessageBtn?.addEventListener('click', () => this.sendChatMessage());
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });

        // Clear chat
        clearChatBtn?.addEventListener('click', () => this.clearChat());

        // Suggested questions
        suggestedQuestions?.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                this.addUserMessage(question);
                this.getAIResponse(question);
            });
        });

        // Quick actions
        quickActions?.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (message) {
            this.addUserMessage(message);
            this.getAIResponse(message);
            chatInput.value = '';
        }
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    getAIResponse(message) {
        // Simulate AI thinking
        setTimeout(() => {
            const lowerMessage = message.toLowerCase();
            let response = '';

            if (lowerMessage.includes('recipe') || lowerMessage.includes('make') || lowerMessage.includes('cook')) {
                response = this.getRecipeResponse();
            } else if (lowerMessage.includes('expire') || lowerMessage.includes('expiration') || lowerMessage.includes('old')) {
                response = this.getExpirationResponse();
            } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('buy')) {
                response = this.getRecommendationResponse();
            } else if (lowerMessage.includes('meal') || lowerMessage.includes('plan') || lowerMessage.includes('week')) {
                response = this.getMealPlanResponse();
            } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                response = 'Hello! I\'m your SmartCart AI assistant. How can I help you with your groceries today?';
            } else {
                response = 'I can help you with recipes, expiration tracking, recommendations, and meal planning. What would you like assistance with?';
            }

            this.addBotMessage(response);
        }, 1000);
    }

    addBotMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message ai';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    clearChat() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="message ai">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Hello! I'm your AI grocery assistant. How can I help you today?</p>
                    <span class="message-time">Just now</span>
                </div>
            </div>
        `;
    }

    handleQuickAction(action) {
        let message = '';
        switch(action) {
            case 'recipe':
                message = 'What recipes can I make?';
                break;
            case 'expiration':
                message = 'What items are expiring soon?';
                break;
            case 'recommend':
                message = 'Give me some recommendations';
                break;
            case 'mealplan':
                message = 'Help me plan meals for this week';
                break;
        }
        
        this.addUserMessage(message);
        this.getAIResponse(message);
    }

    getRecipeResponse() {
        const recipes = [
            "Based on your items, I recommend making avocado toast with eggs for breakfast.",
            "How about a fresh smoothie with banana, milk, and yogurt?",
            "You could make a delicious chicken stir fry with your vegetables.",
            "Pasta primavera would be perfect with your vegetables and pasta."
        ];
        return recipes[Math.floor(Math.random() * recipes.length)];
    }

    getExpirationResponse() {
        const responses = [
            "Your milk expires in 2 days. Consider making pancakes or a smoothie.",
            "Eggs are good for 5 more days - perfect for baking or breakfast.",
            "Bread expires tomorrow - great for French toast or sandwiches."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getRecommendationResponse() {
        const responses = [
            "I recommend adding quinoa for a healthy grain option.",
            "How about trying almond milk as a dairy alternative?",
            "Fresh salmon would be great for your protein needs this week."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getMealPlanResponse() {
        return "Here's a sample meal plan for the week: Monday - Chicken stir fry, Tuesday - Pasta primavera, Wednesday - Quinoa bowls, Thursday - Salmon with veggies, Friday - Homemade pizza. Would you like me to add these ingredients to your shopping list?";
    }

    loadDelivery() {
        // Load active orders
        const activeOrders = document.getElementById('activeOrders');
        if (activeOrders) {
            activeOrders.innerHTML = mockData.activeDeliveries.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-id">${order.id}</span>
                        <span class="order-status status-${order.status.toLowerCase()}">
                            ${order.status}
                        </span>
                    </div>
                    <p class="order-items">${order.items.join(', ')}</p>
                    <div class="order-footer">
                        <span>Estimated: ${order.estimatedDelivery}</span>
                        <span class="order-total">$${order.total}</span>
                    </div>
                </div>
            `).join('');
        }

        // Load delivery history
        const deliveryHistory = document.getElementById('deliveryHistory');
        if (deliveryHistory) {
            deliveryHistory.innerHTML = mockData.deliveryHistory.map(order => `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.date}</td>
                    <td>${order.items}</td>
                    <td>$${order.total}</td>
                    <td><span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></td>
                </tr>
            `).join('');
        }
    }

    loadRecipes() {
        const featuredRecipes = document.getElementById('featuredRecipes');
        if (featuredRecipes) {
            featuredRecipes.innerHTML = mockData.recipes.map(recipe => `
                <div class="product-card">
                    <div class="product-image">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <div class="product-content">
                        <div class="product-header">
                            <h3 class="product-title">${recipe.name}</h3>
                            <span class="product-price">${recipe.prepTime}</span>
                        </div>
                        <p class="product-description">${recipe.description}</p>
                        <div class="tags mb-3">
                            ${recipe.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || ''}
                        </div>
                        <button class="btn btn-primary btn-block">
                            <i class="fas fa-list"></i> Add Ingredients to List
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    addShoppingListItem() {
        const item = prompt('Enter item name:');
        if (item) {
            this.showToast(`Added "${item}" to shopping list`, 'success');
        }
    }

    toggleNotifications() {
        document.getElementById('notificationsPanel').classList.toggle('active');
    }

    toggleMobileMenu() {
        document.querySelector('.mobile-menu-btn').classList.toggle('active');
        document.querySelector('.nav-center').classList.toggle('active');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}"></i>
            </div>
            <div class="toast-content">
                <p>${message}</p>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    async simulateLoading() {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.items = StorageUtil.get(STORAGE_KEYS.CART) || [];
    }

    addItem(item) {
        const existing = this.items.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
        this.save();
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.save();
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = quantity;
            this.save();
        }
    }

    clear() {
        this.items = [];
        this.save();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    save() {
        StorageUtil.set(STORAGE_KEYS.CART, this.items);
    }
}

// Initialize app
const app = new SmartCartApp();
window.app = app;