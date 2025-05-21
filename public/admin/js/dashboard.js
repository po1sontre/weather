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
            const name = document.getElementById('adName').value;
            if (!imageFile) {
                showError('Please select an image file');
                return;
            }
            if (!name) {
                showError('Please enter an ad name');
                return;
            }
            // Fetch current ads to check for duplicate name
            let ads = [];
            try {
                const response = await fetch('/api/ads', { cache: 'no-cache' });
                if (response.ok) {
                    ads = await response.json();
                }
            } catch (err) { /* ignore */ }
            const existingAd = ads.find(ad => ad.name === name);
            if (existingAd) {
                showError('Ad name must be unique');
                return;
            }
            formData.append('image', imageFile);
            formData.append('link', link);
            formData.append('name', name);
            try {
                const response = await fetch('/api/ads', {
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
            console.log('Attempting to fetch ads...');
            const response = await fetch('/api/ads', { cache: "no-cache" });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let ads = await response.json();
            console.log('Ads fetched for dashboard:', ads.length, ads);
            
            // Apply search filter
            if (searchTerm) {
                ads = ads.filter(ad => 
                    ad.link?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            if (ads.length === 0) {
                currentAdsContainer.innerHTML = '<div class="no-ads">No advertisements found</div>';
                console.log('No ads found on dashboard.');
                return;
            }
            
            // Clear current ads and append new cards
            currentAdsContainer.innerHTML = '';

            ads.forEach(ad => {
                const adCard = createAdCard(ad);
                currentAdsContainer.appendChild(adCard);
                // Log the status of the ad just created, especially if it was the one scheduled
                const status = getAdStatus(ad);
                console.log(`Ad card created for ID: ${ad.id}, Status: ${status}${ad.id === currentAdId ? ' (Scheduled Ad)' : ''}`);
            });

             // Reset currentAdId after loading ads
            currentAdId = null;
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
    }; // Added missing closing brace here
    
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

    // Modal handling
    const scheduleModal = document.getElementById('scheduleModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const scheduleForm = document.getElementById('scheduleForm');
    const scheduleBtn = document.getElementById('scheduleSubmitBtn');
    let currentAdId = null;

    function openScheduleModal(adId) {
        console.log(`Attempting to open schedule modal for ad ID: ${adId}`);
        currentAdId = adId;
        scheduleModal.classList.add('show');
        // Reset form
        scheduleForm.reset();
    }

    function closeScheduleModal() {
        scheduleModal.classList.remove('show');
        currentAdId = null;
        scheduleForm.reset();
    }

    closeModalBtn.addEventListener('click', closeScheduleModal);
    document.querySelector('.cancel-btn').addEventListener('click', closeScheduleModal);

    // Close modal when clicking outside
    scheduleModal.addEventListener('click', (e) => {
        if (e.target === scheduleModal) {
            closeScheduleModal();
        }
    });

    // Handle ad upload
    async function handleAdUpload(e) {
        e.preventDefault();
        
        const formData = new FormData();
        const imageFile = document.getElementById('adImage').files[0];
        const link = document.getElementById('adLink').value;
        
        if (!imageFile) {
            showError('Please select an image');
            return;
        }
        
        if (!link) {
            showError('Please enter a link');
            return;
        }
        
        formData.append('image', imageFile);
        formData.append('link', link);
        
        try {
            const response = await fetch('/api/upload-ad', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Failed to upload ad');
            }
            
            const result = await response.json();
            showSuccess('Ad uploaded successfully');
            document.getElementById('uploadForm').reset();
            loadAds(); // Refresh the ad list
        } catch (error) {
            console.error('Error uploading ad:', error);
            showError('Failed to upload ad');
        }
    }

    // Event listeners - use IMMEDIATELY INVOKED FUNCTION to avoid hoisting issues
    (function setupEventListeners() {
        console.log('Setting up event listeners...');
        try {
            const uploadForm = document.getElementById('uploadForm');
            if (uploadForm) {
                uploadForm.addEventListener('submit', handleAdUpload);
            }
            
            function attachScheduleBtnHandler() {
                const scheduleSubmitBtn = document.getElementById('scheduleSubmitBtn');
                if (scheduleSubmitBtn) {
                    console.log('Found schedule button, attaching click handler');
                    scheduleSubmitBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log('Schedule button clicked!');
                        if (!currentAdId) {
                            showError('No ad selected for scheduling');
                            return;
                        }
                        // Get form data manually
                        const startDate = document.getElementById('startDate').value;
                        const endDate = document.getElementById('endDate').value;
                        if (!startDate || !endDate) {
                            showError('Please fill in all required fields');
                            return;
                        }
                        const scheduleData = {
                            id: currentAdId,
                            startDate: startDate,
                            endDate: endDate,
                            displayDays: [0, 1, 2, 3, 4, 5, 6], 
                            startTime: '00:00',
                            endTime: '23:59',
                            priority: 5
                        };
                        console.log('Scheduling ad with data:', scheduleData);
                        fetch('/api/ads', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(scheduleData)
                        })
                        .then(response => response.json())
                        .then(result => {
                            console.log('Schedule API response:', result);
                            showSuccess('Ad scheduled successfully');
                            closeScheduleModal();
                            loadCurrentAds();
                        })
                        .catch(error => {
                            console.error('Scheduling error:', error);
                            showError('Failed to schedule ad: ' + error.message);
                        });
                    });
                } else {
                    console.error('Schedule button not found! Retrying in 500ms...');
                    setTimeout(() => {
                        const retryBtn = document.getElementById('scheduleSubmitBtn');
                        if (retryBtn) {
                            console.log('Found schedule button on retry, attaching click handler');
                            retryBtn.addEventListener('click', function(e) {
                                e.preventDefault();
                                alert('Schedule button now works!');
                            });
                        } else {
                            alert('Schedule button could not be found. Please reload the page.');
                        }
                    }, 500);
                }
            }
            attachScheduleBtnHandler();
            
            // Search functionality
            const searchAdsElem = document.getElementById('searchAds');
            if (searchAdsElem) {
                searchAdsElem.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const adCards = document.querySelectorAll('.ad-card');
                    adCards.forEach(card => {
                        const link = card.querySelector('.ad-link')?.textContent.toLowerCase() || '';
                        const status = card.querySelector('.ad-status-badge')?.textContent.toLowerCase() || '';
                        const isVisible = link.includes(searchTerm) || status.includes(searchTerm);
                        card.style.display = isVisible ? 'block' : 'none';
                    });
                });
            }
        } catch (err) {
            console.error('Error setting up event listeners:', err);
        }
    })();

    // Load and display ads
    async function loadAds() {
        try {
            const response = await fetch('/api/ads');
            if (!response.ok) {
                throw new Error('Failed to fetch ads');
            }
            const ads = await response.json();
            const currentAdsContainer = document.getElementById('currentAds');
            if (!currentAdsContainer) return;
            currentAdsContainer.innerHTML = '';
            ads.forEach(ad => {
                const adCard = createAdCard(ad);
                currentAdsContainer.appendChild(adCard);
            });
            updateStats(ads);
        } catch (error) {
            console.error('Error loading ads:', error);
            showError('Failed to load ads');
        }
    }

    function createAdCard(ad) {
        const card = document.createElement('div');
        const status = getAdStatus(ad);
        const isClickable = status === 'Unscheduled';

        card.className = `ad-card ${isClickable ? 'clickable' : ''}`;
        card.dataset.id = ad.id;
        card.dataset.link = ad.link || '';

        // Add click listener only if clickable
        if (isClickable) {
            card.addEventListener('click', () => {
                console.log(`Ad card clicked for ad ID: ${ad.id}`);
                openScheduleModal(ad.id);
            });
            console.log(`Click listener added to ad card for ad ID: ${ad.id}`);
        }

        card.innerHTML = `
            <div class="ad-status-badge ${status.toLowerCase()}">${status}</div>
            ${ad.name ? `<div class="ad-name">${ad.name}</div>` : ''}
            <img src="${ad.imageUrl}" alt="Ad" class="ad-image">
            <div class="ad-info">
                <p class="ad-link">${ad.link}</p>
                <div class="ad-stats">
                    <span><i class="fas fa-eye"></i> ${ad.impressions || 0}</span>
                    <span><i class="fas fa-mouse-pointer"></i> ${ad.clicks || 0}</span>
                </div>
                ${ad.startDate && ad.endDate ? `
                    <div class="ad-schedule-info">
                        <p><i class="fas fa-calendar"></i> ${formatDate(ad.startDate)} - ${formatDate(ad.endDate)}</p>
                    </div>
                ` : `
                    <div class="ad-schedule-info clickable-hint">
                        <p><i class="fas fa-info-circle"></i> Click to schedule this ad</p>
                    </div>
                `}
            </div>
        `;

        // Prevent click on card from triggering when clicking the delete button
        const deleteButton = card.querySelector('.delete-btn');
        if (deleteButton) {
             deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                console.log(`Delete button clicked for ad ID: ${ad.id}`);
                deleteAd(ad.id);
            });
        }

        return card;
    }

    function getAdStatus(ad) {
        // Use the server-provided status if available
        if (ad.status) return ad.status.charAt(0).toUpperCase() + ad.status.slice(1);
        
        // Fall back to computing from dates if status isn't provided
        if (!ad.startDate || !ad.endDate) return 'Unscheduled';
        
        const now = new Date();
        const startDate = new Date(ad.startDate);
        const endDate = new Date(ad.endDate);
        
        if (now < startDate) return 'Scheduled';
        if (now > endDate) return 'Expired';
        return 'Active';
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatDisplayDays(days) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.map(day => dayNames[day]).join(', ');
    }

    function updateStats(ads) {
        const stats = {
            total: ads.length,
            unscheduled: ads.filter(ad => !ad.startDate || !ad.endDate).length,
            scheduled: ads.filter(ad => ad.startDate && ad.status === 'scheduled').length,
            active: ads.filter(ad => ad.status === 'active').length,
            expired: ads.filter(ad => ad.status === 'expired').length,
            totalImpressions: ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0),
            totalClicks: ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0)
        };
        
        // Update stats display - only if elements exist
        const totalAdsElem = document.getElementById('totalAds');
        if (totalAdsElem) totalAdsElem.textContent = stats.total;
        
        const unscheduledAdsElem = document.getElementById('unscheduledAds');
        if (unscheduledAdsElem) unscheduledAdsElem.textContent = stats.unscheduled;
        
        const scheduledAdsElem = document.getElementById('scheduledAds');
        if (scheduledAdsElem) scheduledAdsElem.textContent = stats.scheduled;
        
        const activeAdsElem = document.getElementById('activeAds');
        if (activeAdsElem) activeAdsElem.textContent = stats.active;
        
        const expiredAdsElem = document.getElementById('expiredAds');
        if (expiredAdsElem) expiredAdsElem.textContent = stats.expired;
        
        const totalImpressionsElem = document.getElementById('totalImpressions');
        if (totalImpressionsElem) totalImpressionsElem.textContent = stats.totalImpressions;
        
        const totalClicksElem = document.getElementById('totalClicks');
        if (totalClicksElem) totalClicksElem.textContent = stats.totalClicks;
    }

    // Initial load
    loadAds();

    // Make openScheduleModal available globally (although now primarily called via event listener)
    window.openScheduleModal = function(adId) {
        console.log(`Attempting to open schedule modal for ad ID: ${adId}`);
        const modal = document.getElementById('scheduleModal');
        const scheduleForm = document.getElementById('scheduleForm');

        if (!modal) {
            console.error('Schedule modal element not found!');
            return;
        }

        if (!scheduleForm) {
             console.error('Schedule form element not found!');
             return;
        }

        // Reset form
        scheduleForm.reset();

        // Set the ad ID in a hidden input
        const scheduleAdIdInput = document.getElementById('scheduleAdId');
        if (scheduleAdIdInput) {
           scheduleAdIdInput.value = adId;
           console.log(`Set scheduleAdIdInput value to: ${adId}`);
        } else {
           console.error('scheduleAdId input element not found!');
        }

        // Show modal
        modal.classList.add('show');
        console.log('Schedule modal should now be visible.');
    }
});