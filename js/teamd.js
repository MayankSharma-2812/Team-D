document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.teamd-container');
    const closeBtn = document.querySelector('.close-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Search functionality for team members
    const actorSearch = document.getElementById('actorSearch');
    if (actorSearch) {
        const allSections = document.querySelectorAll('.mentors-section');
        const mentorCards = document.querySelectorAll('.mentor-card');
        let resultsCount = document.querySelector('.search-results-count');
        
        if (!resultsCount) {
            resultsCount = document.createElement('div');
            resultsCount.className = 'search-results-count';
            document.querySelector('.search-wrapper').appendChild(resultsCount);
        }
        
        actorSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            let visibleCount = 0;
            
            // Show all cards and sections first
            mentorCards.forEach(card => {
                card.style.display = 'flex';
                card.closest('.mentors-grid').style.display = 'grid';
                card.closest('.mentors-section').style.display = 'block';
            });
            
            // If search term is empty, show all and reset
            if (searchTerm === '') {
                resultsCount.textContent = '';
                return;
            }
            
            // Filter cards
            mentorCards.forEach(card => {
                const name = card.querySelector('.mentor-info span').textContent.toLowerCase();
                const role = card.querySelector('.mentor-info p').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || role.includes(searchTerm)) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Update results count
            resultsCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'result' : 'results'} found`;
            
            // Handle section visibility
            allSections.forEach(section => {
                const visibleCards = section.querySelectorAll('.mentor-card[style="display: flex;"]');
                const grid = section.querySelector('.mentors-grid');
                const noResultsMsg = section.querySelector('.no-results-message');
                
                // Remove any existing no results messages
                if (noResultsMsg) {
                    noResultsMsg.remove();
                }
                
                if (visibleCards.length === 0) {
                    // Hide the section if no cards are visible
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                    grid.style.display = 'grid';
                    
                    // Add a divider between sections
                    if (section.previousElementSibling && 
                        section.previousElementSibling.classList.contains('mentors-section')) {
                        section.style.marginTop = '40px';
                        section.style.paddingTop = '30px';
                        section.style.borderTop = '1px solid #333';
                    }
                }
            });
            
            // Show no results message if nothing found
            if (visibleCount === 0) {
                const mainContainer = document.querySelector('.team-section');
                let noResultsMsg = document.getElementById('noResultsMsg');
                
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.id = 'noResultsMsg';
                    noResultsMsg.style.gridColumn = '1 / -1';
                    noResultsMsg.style.textAlign = 'center';
                    noResultsMsg.style.padding = '40px 20px';
                    noResultsMsg.style.color = '#a3a3a3';
                    noResultsMsg.innerHTML = `
                        <i class="fas fa-search" style="font-size: 2.5rem; margin-bottom: 15px; opacity: 0.5;"></i>
                        <h3 style="color: #fff; margin-bottom: 10px;">No matching team members found</h3>
                        <p>Try different keywords or check the spelling</p>
                    `;
                    mainContainer.appendChild(noResultsMsg);
                }
            } else {
                const noResultsMsg = document.getElementById('noResultsMsg');
                if (noResultsMsg) {
                    noResultsMsg.remove();
                }
            }
        });
    }

    // Close button functionality
    closeBtn.addEventListener('click', function () {
        container.style.animation = 'slideDown 0.5s ease-out forwards';
        document.body.style.overflow = 'auto'; // Re-enable scrolling

        // Wait for animation to complete before navigating back
        setTimeout(() => {
            window.history.back(); // Go back to the previous page
        }, 450);
    });

    // Close when clicking outside the content
    container.addEventListener('click', function (e) {
        if (e.target === container) {
            closeBtn.click();
        }
    });

    // Tab functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Close with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeBtn.click();
        }
    });

    // Review System Functionality
    const reviewForm = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');
    const starRating = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('rating');

    // Initialize reviews from localStorage or empty array
    let reviews = JSON.parse(localStorage.getItem('teamDReviews')) || [];

    // Display existing reviews
    function displayReviews() {
        if (!reviewsList) return;

        reviewsList.innerHTML = '';

        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
            return;
        }

        // Sort reviews by date (newest first)
        const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedReviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <span class="review-date">${new Date(review.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</span>
                </div>
                <div class="review-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(review.rating)}${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                </div>
                <div class="review-content">${review.text}</div>
            `;
            reviewsList.appendChild(reviewElement);
        });
    }

    // Handle star rating selection
    if (starRating.length > 0) {
        starRating.forEach(star => {
            star.addEventListener('click', function () {
                const rating = parseInt(this.getAttribute('data-rating'));
                ratingInput.value = rating;

                // Update star display
                starRating.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });

            // Hover effect for stars
            star.addEventListener('mouseover', function () {
                const hoverRating = parseInt(this.getAttribute('data-rating'));
                starRating.forEach((s, index) => {
                    if (index < hoverRating) {
                        s.classList.add('hover');
                    } else {
                        s.classList.remove('hover');
                    }
                });
            });

            // Remove hover effect when mouse leaves
            star.addEventListener('mouseout', function () {
                starRating.forEach(s => s.classList.remove('hover'));
            });
        });
    }

    // Handle form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('reviewerName').value.trim();
            const text = document.getElementById('reviewText').value.trim();
            const rating = parseInt(ratingInput.value);

            if (!name || !text || rating === 0) {
                alert('Please fill in all fields and provide a rating.');
                return;
            }

            // Create new review object
            const newReview = {
                name,
                text,
                rating,
                date: new Date().toISOString()
            };

            // Add to reviews array and save to localStorage
            reviews.push(newReview);
            localStorage.setItem('teamDReviews', JSON.stringify(reviews));

            // Reset form
            this.reset();
            ratingInput.value = '0';
            starRating.forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });

            // Update displayed reviews
            displayReviews();

            // Show success message
            alert('Thank you for your review!');
        });
    }

    // Initialize reviews display
    displayReviews();

    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
});
