document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    function checkAuth() {
        if (!sessionStorage.getItem('isAuthenticated')) {
            window.location.href = 'index.html';
        }
    }
    
    // Logout function
    function logout() {
        sessionStorage.removeItem('isAuthenticated');
        window.location.href = 'index.html';
    }
    
    // Attach logout event listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // File upload preview and click handling
    const adImage = document.getElementById('adImage');
    const fileUpload = document.querySelector('.file-upload');
    
    if (fileUpload && adImage) {
        // Add click handler to the file-upload div
        fileUpload.addEventListener('click', () => {
            adImage.click();
        });
        
        adImage.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const placeholder = document.querySelector('.file-upload-placeholder');
                placeholder.innerHTML = `
                    <div class="file-preview">
                        <img src="${URL.createObjectURL(this.files[0])}" alt="Preview">
                        <span>${this.files[0].name}</span>
                    </div>
                `;
            }
        });
    }
    
    // Handle ad form submission
    const adForm = document.getElementById('adForm');
    const currentAds = document.getElementById('currentAds');
    const searchInput = document.getElementById('searchAds');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Load initial data
    loadCurrentAds();

    if (adForm) {
        adForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            const imageFile = document.getElementById('adImage').files[0];
            const link = document.getElementById('adLink').value;

            if (!imageFile) {
                showError('Please select an image file');
                return;
            }

            formData.append('image', imageFile);
            if (link) {
                formData.append('link', link);
            }

            try {
                const response = await fetch('/api/upload-ad', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const result = await response.json();
                showSuccess('Ad uploaded successfully');
                adForm.reset();
                loadCurrentAds();
            } catch (error) {
                console.error('Upload error:', error);
                showError('Failed to upload ad');
            }
        });
    }

    // Handle search
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const adCards = currentAds.querySelectorAll('.ad-card');
            
            adCards.forEach(card => {
                const adId = card.dataset.id.toLowerCase();
                const adLink = card.dataset.link.toLowerCase();
                const matches = adId.includes(searchTerm) || adLink.includes(searchTerm);
                card.style.display = matches ? 'block' : 'none';
            });
        });
    }

    // Load current ads with search functionality
    async function loadCurrentAds(searchTerm = '') {
        const currentAdsContainer = document.getElementById('currentAds');
        if (!currentAdsContainer) return;
        
        try {
            const response = await fetch('/api/ads');
            if (!response.ok) {
                throw new Error('Failed to fetch ads');
            }
            
            let ads = await response.json();
            
            // Apply search filter
            if (searchTerm) {
                ads = ads.filter(ad => 
                    ad.link?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            if (ads.length === 0) {
                currentAdsContainer.innerHTML = '<div class="no-ads">No advertisements found</div>';
                return;
            }
            
            currentAdsContainer.innerHTML = ads.map(ad => `
                <div class="ad-card" data-id="${ad.id}" data-link="${ad.link}">
                    <img src="${ad.imageUrl}" alt="Ad ${ad.id}">
                    <div class="ad-info">
                        <p class="ad-link">${ad.link}</p>
                        <div class="ad-actions">
                            <button onclick="editAd('${ad.id}')" class="edit-btn">Edit</button>
                            <button onclick="deleteAd('${ad.id}')" class="delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading ads:', error);
            currentAdsContainer.innerHTML = '<div class="error">Error loading ads. Please try again.</div>';
        }
    }
    
    // Delete ad function with confirmation
    window.deleteAd = async function(adId) {
        if (confirm('Are you sure you want to delete this ad? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/ads?id=${adId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    throw new Error('Delete failed');
                }
                
                // Show success message
                showSuccess('Ad deleted successfully');
                
                // Reload ads
                loadCurrentAds();
            } catch (error) {
                console.error('Delete error:', error);
                showError('Error deleting ad. Please try again.');
            }
        }
    };
    
    // Show success message
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
    
    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
    
    // Initialize dashboard
    function initDashboard() {
        checkAuth();
        loadCurrentAds();
    }
    
    // Initialize if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard();
    }
    
    // Make functions available globally
    window.logout = logout;
    window.showSuccess = showSuccess;
    window.showError = showError;
});