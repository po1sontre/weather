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
    
    // File upload preview
    const adImage = document.getElementById('adImage');
    if (adImage) {
        adImage.addEventListener('change', function(e) {
            const fileUpload = document.querySelector('.file-upload');
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
    if (adForm) {
        adForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            const imageFile = document.getElementById('adImage').files[0];
            
            if (!imageFile) {
                showError('Please select an image');
                return;
            }
            
            // Validate image size (max 3MB)
            if (imageFile.size > 3 * 1024 * 1024) {
                showError('Image size should be less than 3MB');
                return;
            }
            
            // Validate image type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(imageFile.type)) {
                showError('Please upload a valid image file (PNG, JPG, or GIF)');
                return;
            }
            
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('link', document.getElementById('adLink').value);
            
            try {
                const response = await fetch('/api/upload-ad', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error('Upload failed');
                }
                
                const newAd = await response.json();
                
                // Show success message
                showSuccess('Ad uploaded successfully!');
                
                // Reset form
                adForm.reset();
                document.querySelector('.file-upload-placeholder').innerHTML = `
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Click to upload image</span>
                    <span class="file-hint">PNG, JPG or GIF (max. 2MB)</span>
                `;
                
                // Reload ads
                loadCurrentAds();
            } catch (error) {
                console.error('Upload error:', error);
                showError('Error uploading ad. Please try again.');
            }
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
                <div class="ad-preview" data-id="${ad.id}">
                    <img src="${ad.imageUrl}" alt="Advertisement" class="ad-image">
                    <div class="ad-details">
                        ${ad.link ? `<a href="${ad.link}" target="_blank" class="ad-link">${ad.link}</a>` : ''}
                        <div class="ad-actions">
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
                const response = await fetch(`/api/delete-ad/${adId}`, {
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
    
    // Search functionality
    const searchInput = document.getElementById('searchAds');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            loadCurrentAds(e.target.value);
        });
    }
    
    // Show success message
    function showSuccess(message) {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }
    }
    
    // Show error message
    function showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        }
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

    async function loadDashboardStats() {
        try {
            const response = await fetch('/api/stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            const stats = await response.json();
            
            document.getElementById('totalAds').textContent = stats.totalAds;
            document.getElementById('activeAds').textContent = stats.activeAds;
            document.getElementById('impressions').textContent = stats.totalImpressions;
            document.getElementById('pendingAds').textContent = stats.pendingAds;
            
            // Update change indicators
            updateStatChange('totalAdsChange', stats.totalAdsChange);
            updateStatChange('activeAdsChange', stats.activeAdsChange);
            updateStatChange('impressionsChange', stats.impressionsChange);
            updateStatChange('pendingAdsChange', stats.pendingAdsChange);
        } catch (error) {
            console.error('Error loading stats:', error);
            showError('Failed to load dashboard statistics');
        }
    }

    async function loadCurrentAds() {
        try {
            const response = await fetch('/api/ads');
            if (!response.ok) throw new Error('Failed to fetch ads');
            const ads = await response.json();
            
            const adsList = document.getElementById('currentAds');
            adsList.innerHTML = '';
            
            if (ads.length === 0) {
                adsList.innerHTML = '<p class="text-gray-500">No ads found</p>';
                return;
            }
            
            ads.forEach(ad => {
                const adElement = document.createElement('div');
                adElement.className = 'bg-white p-4 rounded-lg shadow mb-4';
                adElement.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <img src="${ad.imageUrl}" alt="Ad preview" class="w-16 h-16 object-cover rounded">
                            <div>
                                <h3 class="font-semibold">Ad #${ad.id}</h3>
                                <p class="text-sm text-gray-500">Status: ${ad.status}</p>
                                <p class="text-sm text-gray-500">Impressions: ${ad.impressions || 0}</p>
                                <p class="text-sm text-gray-500">Clicks: ${ad.clicks || 0}</p>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="editAd('${ad.id}')" class="text-blue-500 hover:text-blue-700">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteAd('${ad.id}')" class="text-red-500 hover:text-red-700">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                adsList.appendChild(adElement);
            });
        } catch (error) {
            console.error('Error loading ads:', error);
            showError('Failed to load current ads');
        }
    }

    async function uploadAd(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/api/upload-ad', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.details || 'Failed to upload ad');
            }
            
            showSuccess('Ad uploaded successfully');
            form.reset();
            loadCurrentAds();
            loadDashboardStats();
        } catch (error) {
            console.error('Error uploading ad:', error);
            showError(error.message || 'Failed to upload ad');
        }
    }

    async function deleteAd(id) {
        if (!confirm('Are you sure you want to delete this ad?')) return;
        
        try {
            const response = await fetch(`/api/delete-ad/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.details || 'Failed to delete ad');
            }
            
            showSuccess('Ad deleted successfully');
            loadCurrentAds();
            loadDashboardStats();
        } catch (error) {
            console.error('Error deleting ad:', error);
            showError(error.message || 'Failed to delete ad');
        }
    }
});