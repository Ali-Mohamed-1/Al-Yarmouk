/**
 * Dynamic Content Loader for Al-Yarmouk Website
 * Handles loading product data and rendering pages dynamically
 */

class ProductPageLoader {
    constructor() {
        this.productsData = null;
        this.init();
    }

    async init() {
        await this.loadProductsData();
        this.renderPage();
    }

    async loadProductsData() {
        try {
            const response = await fetch('../data/products.json');
            this.productsData = await response.json();
        } catch (error) {
            console.error('Error loading products data:', error);
            // Fallback to hardcoded data if JSON fails
            this.productsData = this.getFallbackData();
        }
    }

    getFallbackData() {
        return {
            "products": {
                "paints": {
                    "title": "Paint Additives",
                    "icon": "fa-solid fa-fill-drip",
                    "products": [
                        {
                            "name": "SAF",
                            "description": "Solid defoamer for minerally bound construction material systems"
                        },
                        {
                            "name": "Disperse AY45",
                            "description": "Solid defoamer for minerally bound construction material systems"
                        },
                        {
                            "name": "Anti-foam 610",
                            "description": "VOC-free silicone-containing Defoamer for aqueous architectural coatings and adhesives. Preferably used in emulsion systems with a PVC of 45-85."
                        },
                        {
                            "name": "Anti-foam 600",
                            "description": "Defoamer for aqueous coatings, printing inks, adhesives, paper coatings, and construction chemicals that is polymer-based, silicone-free, and free of VOC."
                        }
                    ]
                }
            }
        };
    }

    getCurrentProductType() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];
        return filename;
    }

    renderPage() {
        const productType = this.getCurrentProductType();
        const productData = this.productsData.products[productType];

        if (!productData) {
            console.error('Product data not found for:', productType);
            return;
        }

        this.renderHeader(productData);
        this.renderProducts(productData);
    }

    renderHeader(productData) {
        const pageHeader = document.getElementById('page-header');
        if (pageHeader) {
            pageHeader.innerHTML = `
                <div class="page-header fade-in">
                    <h1>${productData.title}</h1>
                </div>
            `;
        }
    }

    renderProducts(productData) {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;

        const productType = this.getCurrentProductType();
        
        // Use 3-column layout for ink, polymer, cementitious, and textile
        const useThreeColumns = ['ink', 'polymer', 'cementitious', 'textile'].includes(productType);
        const gridClass = useThreeColumns ? 'subpage-products-grid' : 'products-grid';

        productsContainer.innerHTML = `
            <div class="${gridClass}">
                ${productData.products.map((product, index) => `
                    <div class="product-card slide-in-left" style="animation-delay: ${index * 0.1}s">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <div class="product-buttons">
                            <a href="mailto:alyarmouk.company.0@gmail.com?subject=${encodeURIComponent(product.name)} Request" 
                               class="modern-btn">
                                <span>Request a sample</span>
                            </a>
                            <a href="../${product.tds_path || '#'}" class="modern-btn secondary-btn" target="_blank">
                                <span>Download TDS</span>
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductPageLoader();
});

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation for buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.modern-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="loading-spinner"></span> Loading...';
            
            // Reset after a short delay (for demo purposes)
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
});
