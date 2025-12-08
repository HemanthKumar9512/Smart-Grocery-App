// Enhanced Mock Data
const mockData = {
    users: [
        {
            id: 1,
            name: "Alex Johnson",
            email: "alex@example.com",
            password: "password123",
            preferences: {
                dietaryRestrictions: ["Vegetarian"],
                allergies: ["Peanuts"],
                favoriteCuisines: ["Italian", "Mexican"],
                budget: 200
            }
        }
    ],

    groceries: [
        {
            id: 1,
            name: "Organic Avocados",
            category: "fruits",
            price: 2.99,
            icon: "avocado",
            description: "Fresh organic avocados from California, perfect for salads and toast.",
            inStock: true,
            tags: ["organic", "healthy", "fruits"]
        },
        {
            id: 2,
            name: "Fresh Whole Milk",
            category: "dairy",
            price: 3.49,
            icon: "wine-bottle",
            description: "Whole milk, 1 gallon. Great for cereals and baking.",
            inStock: true,
            expiryDate: "2024-12-15",
            tags: ["dairy", "fresh", "essential"]
        },
        {
            id: 3,
            name: "Free Range Eggs",
            category: "dairy",
            price: 4.99,
            icon: "egg",
            description: "12 count, free range eggs. Perfect for breakfast and baking.",
            inStock: true,
            expiryDate: "2024-12-20",
            tags: ["protein", "organic", "breakfast"]
        },
        {
            id: 4,
            name: "Whole Wheat Bread",
            category: "bakery",
            price: 2.49,
            icon: "bread-slice",
            description: "Freshly baked whole wheat bread with grains.",
            inStock: true,
            expiryDate: "2024-12-10",
            tags: ["bakery", "healthy", "grains"]
        },
        {
            id: 5,
            name: "Organic Chicken Breast",
            category: "meat",
            price: 8.99,
            icon: "drumstick-bite",
            description: "Boneless, skinless chicken breast. Perfect for grilling.",
            inStock: true,
            tags: ["protein", "organic", "meat"]
        },
        {
            id: 6,
            name: "Fresh Spinach",
            category: "vegetables",
            price: 2.99,
            icon: "leaf",
            description: "Organic baby spinach for salads and cooking.",
            inStock: true,
            tags: ["vegetables", "healthy", "organic"]
        },
        {
            id: 7,
            name: "Bananas",
            category: "fruits",
            price: 0.49,
            icon: "banana",
            description: "Fresh bananas, per piece. Great for smoothies and snacks.",
            inStock: true,
            tags: ["fruits", "snack", "healthy"]
        },
        {
            id: 8,
            name: "Greek Yogurt",
            category: "dairy",
            price: 1.29,
            icon: "cheese",
            description: "Plain Greek yogurt, 5.3 oz. High protein breakfast option.",
            inStock: true,
            tags: ["dairy", "protein", "breakfast"]
        }
    ],

    recommendations: [
        {
            id: 101,
            name: "Avocado Toast Kit",
            price: 5.99,
            reason: "Perfect for your expiring bread and avocados",
            discount: "15% OFF",
            tags: ["Breakfast", "Healthy", "Quick"]
        },
        {
            id: 102,
            name: "Organic Chicken",
            price: 12.99,
            reason: "Matches your protein needs for the week",
            tags: ["High Protein", "Organic"]
        },
        {
            id: 103,
            name: "Quinoa & Veggies",
            price: 8.49,
            reason: "Complete meal kit for healthy dinners",
            tags: ["Vegetarian", "Meal Kit"]
        },
        {
            id: 104,
            name: "Smoothie Pack",
            price: 6.99,
            reason: "Use your expiring fruits and yogurt",
            discount: "10% OFF",
            tags: ["Breakfast", "Healthy", "Quick"]
        }
    ],

    expiringItems: [
        {
            id: 1,
            name: "Fresh Milk",
            daysLeft: 2,
            icon: "wine-bottle"
        },
        {
            id: 2,
            name: "Eggs",
            daysLeft: 5,
            icon: "egg"
        },
        {
            id: 3,
            name: "Whole Wheat Bread",
            daysLeft: 1,
            icon: "bread-slice"
        }
    ],

    activities: [
        {
            type: "success",
            icon: "check-circle",
            message: "Order #12345 delivered successfully",
            time: "2 hours ago"
        },
        {
            type: "warning",
            icon: "exclamation-triangle",
            message: "Milk will expire in 2 days",
            time: "Yesterday"
        },
        {
            type: "info",
            icon: "robot",
            message: "AI generated weekly meal plan",
            time: "Dec 8, 2024"
        },
        {
            type: "primary",
            icon: "shopping-cart",
            message: "Added 3 items to your cart",
            time: "Dec 7, 2024"
        }
    ],

    activeDeliveries: [
        {
            id: "ORD-12345",
            items: ["Milk", "Eggs", "Bread"],
            status: "Processing",
            estimatedDelivery: "Today, 3:00 PM",
            total: 24.99
        },
        {
            id: "ORD-12346",
            items: ["Chicken", "Spinach", "Tomatoes"],
            status: "Shipped",
            estimatedDelivery: "Tomorrow, 10:00 AM",
            total: 32.50
        }
    ],

    deliveryHistory: [
        {
            id: "ORD-12344",
            date: "2024-12-01",
            items: "Apples, Bananas, Yogurt",
            total: 24.99,
            status: "Delivered"
        },
        {
            id: "ORD-12343",
            date: "2024-11-28",
            items: "Pasta, Sauce, Cheese",
            total: 18.50,
            status: "Delivered"
        },
        {
            id: "ORD-12342",
            date: "2024-11-25",
            items: "Rice, Beans, Vegetables",
            total: 32.75,
            status: "Delivered"
        }
    ],

    recipes: [
        {
            id: 1,
            name: "Avocado Toast",
            description: "Healthy breakfast with avocado on whole wheat toast",
            prepTime: "10 mins",
            tags: ["Breakfast", "Healthy", "Quick"],
            ingredients: ["Avocado", "Bread", "Lemon", "Salt", "Pepper"]
        },
        {
            id: 2,
            name: "Chicken Stir Fry",
            description: "Quick and healthy chicken stir fry with vegetables",
            prepTime: "20 mins",
            tags: ["Dinner", "High Protein", "Healthy"],
            ingredients: ["Chicken", "Mixed Vegetables", "Soy Sauce", "Garlic"]
        },
        {
            id: 3,
            name: "Fruit Smoothie",
            description: "Refreshing smoothie with banana and yogurt",
            prepTime: "5 mins",
            tags: ["Breakfast", "Quick", "Healthy"],
            ingredients: ["Banana", "Yogurt", "Milk", "Honey"]
        },
        {
            id: 4,
            name: "Quinoa Bowl",
            description: "Healthy quinoa bowl with roasted vegetables",
            prepTime: "25 mins",
            tags: ["Lunch", "Vegetarian", "Healthy"],
            ingredients: ["Quinoa", "Mixed Vegetables", "Olive Oil", "Spices"]
        }
    ]
};

// Storage Utilities
const STORAGE_KEYS = {
    USER: 'smartcart_user',
    CART: 'smartcart_cart',
    PREFERENCES: 'smartcart_preferences'
};

class StorageUtil {
    static get(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }
}