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

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || result.details || 'Upload failed');
                }

                showSuccess('Ad uploaded successfully');
                adForm.reset();
                // Reset the file preview
                const placeholder = document.querySelector('.file-upload-placeholder');
                if (placeholder) {
                    placeholder.innerHTML = `
                        <div class="upload-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        <span>Click to upload image</span>
                    `;
                }
                loadCurrentAds();
            } catch (error) {
                console.error('Upload error:', error);
                showError(error.message || 'Failed to upload ad. Please try again.');
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
                        <div class="ad-id-row" style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
                            <span class="ad-id-label" style="font-size:0.85em;color:#888;">ID:</span>
                            <span class="ad-id-value" style="font-family:monospace;user-select:all;">${ad.id}</span>
                            <button class="copy-id-btn" data-ad-id="${ad.id}" title="Copy Ad ID" style="padding:2px 8px;font-size:0.85em;cursor:pointer;">Copy</button>
                            <button class="change-id-btn" data-ad-id="${ad.id}" title="Change Ad ID" style="padding:2px 8px;font-size:0.85em;cursor:pointer;">Change ID</button>
                        </div>
                        <div class="change-id-row" style="display:none;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
                            <input type="text" class="new-id-input" value="${ad.id}" style="font-family:monospace;font-size:0.95em;width:120px;">
                            <button class="save-id-btn" data-ad-id="${ad.id}" style="padding:2px 8px;font-size:0.85em;cursor:pointer;">Save</button>
                            <button class="cancel-id-btn" data-ad-id="${ad.id}" style="padding:2px 8px;font-size:0.85em;cursor:pointer;">Cancel</button>
                        </div>
                        <p class="ad-link">${ad.link}</p>
                        <div class="ad-actions">
                            <button onclick="deleteAd('${ad.id}')" class="delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add copy event listeners
            currentAdsContainer.querySelectorAll('.copy-id-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const adId = this.getAttribute('data-ad-id');
                    navigator.clipboard.writeText(adId).then(() => {
                        this.textContent = 'Copied!';
                        setTimeout(() => {
                            this.textContent = 'Copy';
                        }, 1200);
                    });
                });
            });

            // Add change ID event listeners
            currentAdsContainer.querySelectorAll('.change-id-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const card = this.closest('.ad-info');
                    card.querySelector('.ad-id-row').style.display = 'none';
                    card.querySelector('.change-id-row').style.display = 'flex';
                });
            });
            currentAdsContainer.querySelectorAll('.cancel-id-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const card = this.closest('.ad-info');
                    card.querySelector('.change-id-row').style.display = 'none';
                    card.querySelector('.ad-id-row').style.display = 'flex';
                });
            });
            currentAdsContainer.querySelectorAll('.save-id-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const card = this.closest('.ad-info');
                    const oldId = this.getAttribute('data-ad-id');
                    const newId = card.querySelector('.new-id-input').value.trim();
                    if (!newId) {
                        showError('New ID cannot be empty');
                        return;
                    }
                    if (oldId === newId) {
                        card.querySelector('.change-id-row').style.display = 'none';
                        card.querySelector('.ad-id-row').style.display = 'flex';
                        return;
                    }
                    try {
                        const response = await fetch('/api/ads/change-id', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ oldId, newId })
                        });
                        const result = await response.json();
                        if (!response.ok || !result.success) {
                            throw new Error(result.error || 'Failed to change ID');
                        }
                        showSuccess('Ad ID changed successfully');
                        loadCurrentAds();
                    } catch (error) {
                        showError(error.message || 'Failed to change ad ID');
                    }
                });
            });
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