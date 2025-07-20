// NASA APOD API endpoint and key
const API_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = 'DEMO_KEY'; // Replace with your own key for more requests

// Array of fun space facts
const spaceFacts = [
  "Did you know? The Sun accounts for about 99.86% of the mass in our solar system.",
  "Did you know? A day on Venus is longer than its year.",
  "Did you know? Neutron stars can spin at a rate of 600 times per second.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Jupiter has 92 known moons!",
  "Did you know? The footprints on the Moon will remain for millions of years.",
  "Did you know? Saturn's rings are made mostly of ice particles.",
  "Did you know? The largest volcano in the solar system is on Mars.",
  "Did you know? Space is completely silent.",
  "Did you know? The Milky Way galaxy is about 100,000 light-years across."
];

// Show a random space fact when the page loads
const spaceFactEl = document.getElementById('spaceFact');
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
spaceFactEl.textContent = randomFact;

// Get DOM elements
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

// Helper function to check if a date string is valid
function isValidDate(dateStr) {
  return !isNaN(Date.parse(dateStr));
}

// Function to fetch APOD images/videos for a selected date range
async function fetchImages(startDateStr, endDateStr) {
  // Show loading message
  loading.style.display = 'block';
  gallery.innerHTML = '';

  // Build API URL with parameters
  const url = `${API_URL}?api_key=${API_KEY}&start_date=${startDateStr}&end_date=${endDateStr}`;

  try {
    // Fetch data from NASA API
    const response = await fetch(url);
    const data = await response.json();

    // Hide loading message
    loading.style.display = 'none';

    // Check for errors
    if (data.error || !Array.isArray(data)) {
      gallery.innerHTML = `<p style="color:red;">No images found for this range. Try a different date range!</p>`;
      return;
    }

    // Sort by date (newest first)
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create gallery items
    data.forEach(item => {
      // Handle images and videos
      let mediaHtml = '';
      if (item.media_type === 'image') {
        // Show image
        mediaHtml = `<img src="${item.url}" alt="${item.title}" />`;
      } else if (item.media_type === 'video' && item.url.includes('youtube.com')) {
        // Embed YouTube video
        // Convert watch?v= to embed/ for iframe
        const embedUrl = item.url.replace('watch?v=', 'embed/');
        mediaHtml = `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
      } else if (item.media_type === 'video') {
        // Link to non-YouTube video
        mediaHtml = `<a href="${item.url}" target="_blank">Watch Video</a>`;
      } else {
        // Skip unknown media types
        return;
      }

      // Create gallery item element
      const itemDiv = document.createElement('div');
      itemDiv.className = 'gallery-item';
      itemDiv.innerHTML = `
        ${mediaHtml}
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;

      // Add click event to open modal
      itemDiv.addEventListener('click', () => {
        showModal(item);
      });

      gallery.appendChild(itemDiv);
    });

    // If no items, show message
    if (gallery.children.length === 0) {
      gallery.innerHTML = `<p>No images or videos found for this range.</p>`;
    }
  } catch (error) {
    loading.style.display = 'none';
    gallery.innerHTML = `<p style="color:red;">Error loading images. Please try again later.</p>`;
  }
}

// Show modal with image/video and details
function showModal(item) {
  let mediaHtml = '';
  if (item.media_type === 'image') {
    mediaHtml = `<img src="${item.url}" alt="${item.title}" />`;
  } else if (item.media_type === 'video' && item.url.includes('youtube.com')) {
    const embedUrl = item.url.replace('watch?v=', 'embed/');
    mediaHtml = `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
  } else if (item.media_type === 'video') {
    mediaHtml = `<a href="${item.url}" target="_blank">Watch Video</a>`;
  }

  // Fill modal content
  modalContent.innerHTML = `
    <button class="close-btn" title="Close">&times;</button>
    ${mediaHtml}
    <h2>${item.title}</h2>
    <p><strong>Date:</strong> ${item.date}</p>
    <p>${item.explanation}</p>
  `;
  modal.style.display = 'flex';

  // Close modal when clicking close button
  modalContent.querySelector('.close-btn').onclick = closeModal;
}

// Close modal function
function closeModal() {
  modal.style.display = 'none';
}

// Close modal when clicking outside content
modal.onclick = function(event) {
  if (event.target === modal) {
    closeModal();
  }
};

// Handle button click to fetch images
getImagesBtn.addEventListener('click', () => {
  // Get selected start and end dates
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  // Validate dates
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    gallery.innerHTML = `<p style="color:red;">Please select both a valid start and end date.</p>`;
    return;
  }
  if (new Date(startDate) > new Date(endDate)) {
    gallery.innerHTML = `<p style="color:red;">Start date must be before end date.</p>`;
    return;
  }

  // Fetch images for selected range
  fetchImages(startDate, endDate);
});

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);
setupDateInputs(startInput, endInput);
