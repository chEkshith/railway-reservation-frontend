// --- CORE WEB APPLICATION DATABASE ---
const stations = [
  "Noida",
  "Bengaluru",
  "Delhi",
  "Mumbai",
  "Kolkata",
  "Chennai",
  "Secunderabad",
  "Ahmedabad",
  "Agra"
];

const trainNames = [
  "Vande Bharat Express",
  "Rajdhani Express",
  "Shatabdi Express",
  "Duronto Express",
  "Garib Rath",
  "Superfast Deccan Queen",
  "Gatimaan Express",
  "Coromandel Express"
];

// Generate an extensive, rich set of sample train data
const trainData = [];
stations.forEach((fromStation) => {
  stations.forEach((toStation) => {
    if (fromStation !== toStation) {
      for (let i = 1; i <= 3; i++) {
        const trainIndex = (stations.indexOf(fromStation) * 10 + stations.indexOf(toStation) * 3 + i) % trainNames.length;
        const trainNum = 12000 + (stations.indexOf(fromStation) * 12) + (stations.indexOf(toStation) * 5) + i;
        const departureHrs = (6 + (i * 4) + stations.indexOf(fromStation)) % 24;
        const departureMins = i * 15 % 60;
        const durationHrs = 4 + (Math.abs(stations.indexOf(fromStation) - stations.indexOf(toStation)) * 3);
        const arrivalHrs = (departureHrs + durationHrs) % 24;
        
        const depTime = `${String(departureHrs).padStart(2, '0')}:${String(departureMins).padStart(2, '0')} ${departureHrs >= 12 ? 'PM' : 'AM'}`;
        const arrTime = `${String(arrivalHrs).padStart(2, '0')}:${String(departureMins).padStart(2, '0')} ${arrivalHrs >= 12 ? 'PM' : 'AM'}`;
        const durationStr = `${durationHrs}h 00m`;
        
        const priceBase = 450 + (durationHrs * 120);
        
        const train = {
          trainNumber: trainNum,
          trainName: `${trainNames[trainIndex]} (${trainNum})`,
          from: fromStation,
          to: toStation,
          departure: depTime,
          arrival: arrTime,
          duration: durationStr,
          classes: i === 1 ? ["1A", "2A", "CC"] : ["2A", "3A", "SL"],
          fare: priceBase,
          availability: i === 3 ? "Waiting List (WL 8)" : i === 2 ? "Booked" : "Available",
          availableSeatsCount: i === 3 ? 0 : i === 2 ? 0 : 25 + (i * 8)
        };
        trainData.push(train);
      }
    }
  });
});

// Current active booking state
let activeBooking = {
  train: null,
  selectedSeats: [],
  passengers: [],
  selectedClass: "3A",
  journeyDate: ""
};

// Simulated GPS train progress routes
const routesGPS = {
  "Noida-Bengaluru": ["Noida", "Agra", "Nagpur", "Secunderabad", "Bengaluru"],
  "Noida-Delhi": ["Noida", "Ghaziabad", "New Delhi"],
  "Mumbai-Agra": ["Mumbai", "Surat", "Ratlam", "Kota", "Agra"],
  "Kolkata-Delhi": ["Howrah", "Patna", "Prayagraj", "Kanpur", "Delhi"],
  "Delhi-Kolkata": ["Delhi", "Kanpur", "Prayagraj", "Patna", "Howrah"]
};

// --- INITIALIZE & CONTEXT LOADERS ---
document.addEventListener("DOMContentLoaded", () => {
  setupNavbarProfile();
  setupAutocomplete("from", "from-suggestions");
  setupAutocomplete("to", "to-suggestions");
  setupSearchForm();
  setupModalEvents();
  setupFaqAccordion();
  checkUrlParamsForDashboard();
});

// --- URL ROUTING & STATE CHECKERS ---
function checkUrlParamsForDashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("view") === "dashboard") {
    setTimeout(() => {
      triggerDashboardView();
    }, 100);
  }
}

// --- NAVIGATION & LOGIN STATE SYSTEM ---
function setupNavbarProfile() {
  const username = localStorage.getItem("username");
  const navUl = document.querySelector(".navbar ul");
  if (!navUl) return;

  // Clear nav and build dynamically to support Guest vs Member states
  navUl.innerHTML = `
    <li><a href="index.html" id="nav-home">Home</a></li>
    ${username ? '<li><a href="#" id="nav-dashboard">My Bookings</a></li>' : ''}
    <li><a href="train.html">Train Info</a></li>
    ${username ? `
      <li>
        <div class="user-profile-pill">
          <div class="avatar">${username.charAt(0).toUpperCase()}</div>
          <span>Welcome, ${username}</span>
          <a href="#" id="logout-btn" style="margin-left: 0.5rem; font-size: 0.75rem; color: #f43f5e; text-decoration: underline; font-weight: 500;">Logout</a>
        </div>
      </li>
    ` : '<li><a href="login.html">Login</a></li>'}
  `;

  // Bind navbar listeners
  const navHome = document.getElementById("nav-home");
  const navDashboard = document.getElementById("nav-dashboard");

  if (navDashboard) {
    navDashboard.addEventListener("click", (e) => {
      e.preventDefault();
      triggerDashboardView();
    });
  }

  if (navHome) {
    navHome.addEventListener("click", (e) => {
      // If we are currently in dashboard view, return to home search
      const mainSearchSection = document.querySelector(".search-section");
      const resultsSection = document.getElementById("results-section");
      if (mainSearchSection && resultsSection) {
        e.preventDefault();
        mainSearchSection.style.display = "block";
        resultsSection.style.display = "block";
        // Remove dashboard if existing
        const dashboard = document.getElementById("dashboard-container");
        if (dashboard) dashboard.remove();
        
        // Toggle navbar active classes
        if (navDashboard) navDashboard.parentElement.classList.remove("active");
        navHome.parentElement.classList.add("active");
      }
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("username");
      setupNavbarProfile();
      window.location.href = "index.html";
    });
  }
}

// --- AUTOCOMPLETE SUGGESTIONS ENGINE ---
function setupAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  input.addEventListener("input", () => {
    const value = input.value.trim().toLowerCase();
    dropdown.innerHTML = "";
    
    if (value.length === 0) {
      dropdown.style.display = "none";
      return;
    }

    const filtered = stations.filter(station => station.toLowerCase().includes(value));
    
    if (filtered.length === 0) {
      dropdown.style.display = "none";
      return;
    }

    filtered.forEach(station => {
      const item = document.createElement("div");
      item.className = "autocomplete-item";
      
      const regex = new RegExp(`(${value})`, "gi");
      const boldedName = station.replace(regex, "<strong>$1</strong>");
      
      item.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span>${boldedName}</span>
      `;
      
      item.addEventListener("click", () => {
        input.value = station;
        dropdown.style.display = "none";
      });
      dropdown.appendChild(item);
    });

    dropdown.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

// --- SEARCH & FILTER CONTROLLER ---
function setupSearchForm() {
  const form = document.getElementById("search-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const date = document.getElementById("journey-date").value;
    const selectedClass = document.getElementById("travel-class")?.value || "3A";
    
    const resultsSection = document.getElementById("results-section");
    if (!resultsSection) return;

    activeBooking.journeyDate = date;
    activeBooking.selectedClass = selectedClass;

    resultsSection.innerHTML = `
      <div class="results-loader">
        <div class="train-track-loader"></div>
        <p style="color: var(--text-secondary); font-size: 0.95rem; font-weight: 500;">Searching Indian Railway network for real-time trains...</p>
      </div>
    `;

    setTimeout(() => {
      renderSearchResults(from, to, resultsSection);
    }, 850);
  });
}

function renderSearchResults(from, to, container) {
  container.innerHTML = "";

  const filteredTrains = trainData.filter(train => 
    train.from.toLowerCase() === from.toLowerCase() && 
    train.to.toLowerCase() === to.toLowerCase()
  );

  if (filteredTrains.length === 0) {
    container.innerHTML = `
      <div style="background: var(--bg-dark-card); border: 1px dashed var(--border-glass); border-radius: var(--radius-lg); padding: 3rem; text-align: center;">
        <svg width="48" height="48" fill="var(--text-muted)" viewBox="0 0 24 24" style="margin-bottom: 1rem;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        <h3 style="font-family: var(--font-headings); font-size: 1.4rem; color: #fff; margin-bottom: 0.5rem;">No Direct Trains Found</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 400px; margin: 0 auto;">We couldn't locate direct trains matching this specific route. Try selecting another hub like Delhi, Mumbai, or Bengaluru.</p>
      </div>
    `;
    return;
  }

  const headerDiv = document.createElement("div");
  headerDiv.innerHTML = `
    <h2 class="results-heading">${filteredTrains.length} Trains Connecting ${from} to ${to}</h2>
    <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">Fares are updated. Click Book Now to configure coach seat selection.</p>
  `;
  container.appendChild(headerDiv);

  filteredTrains.forEach((train, idx) => {
    const card = document.createElement("div");
    card.className = "train-card";
    card.style.animationDelay = `${idx * 0.1}s`;

    let statusClass = "available";
    let statusText = `Available - ${train.availableSeatsCount} seats`;
    let isBooked = false;

    if (train.availability === "Booked") {
      statusClass = "booked";
      statusText = "Fully Booked";
      isBooked = true;
    } else if (train.availability.includes("Waiting List")) {
      statusClass = "waiting";
      statusText = train.availability;
    }

    card.innerHTML = `
      <div class="train-details-wrap">
        <div class="train-title-tag">
          <svg width="18" height="18" fill="var(--accent-cyan)" viewBox="0 0 24 24"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm4.5-5H7V6h5v6zm5 3.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm1.5-3.5h-5V6h5v6z"/></svg>
          <span>${train.trainName}</span>
        </div>
        <div class="train-class-pills">
          ${train.classes.map(c => `<span class="class-pill">${c}</span>`).join('')}
        </div>
        <div class="train-availability-status">
          <span class="status-dot ${statusClass}"></span>
          <span class="status-text ${statusClass}">${statusText}</span>
        </div>
      </div>

      <div class="train-journey-path">
        <div class="journey-node">
          <div class="journey-time">${train.departure}</div>
          <div class="journey-station">${train.from}</div>
        </div>
        <div class="journey-track-container">
          <div class="journey-duration">${train.duration}</div>
          <div class="journey-track"></div>
          <div class="journey-train-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zm0 15c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
          </div>
        </div>
        <div class="journey-node">
          <div class="journey-time">${train.arrival}</div>
          <div class="journey-station">${train.to}</div>
        </div>
      </div>

      <div class="train-price-cta">
        <div style="text-align: right;">
          <div class="train-fare-label">Starting Class Fare</div>
          <div class="train-fare-amount">₹${train.fare}</div>
        </div>
        <button class="book-button" ${isBooked ? 'disabled' : ''}>${isBooked ? 'Unavailable' : 'Book Now'}</button>
      </div>
    `;

    const bookBtn = card.querySelector(".book-button");
    if (bookBtn) {
      bookBtn.addEventListener("click", () => {
        // AUTHENTICATION GUARD CHECK
        const username = localStorage.getItem("username");
        if (!username) {
          triggerAuthRequiredModal();
        } else {
          triggerSeatSelectionModal(train);
        }
      });
    }

    container.appendChild(card);
  });
}

// --- AUTHENTICATION REQUIRED PROMPT ---
function triggerAuthRequiredModal() {
  const authModal = document.getElementById("auth-required-modal");
  const modalBody = authModal.querySelector(".modal-body");
  if (!authModal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="auth-required-box">
      <div class="auth-lock-icon">
        <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
      </div>
      <h3 style="font-family: var(--font-headings); font-size: 1.4rem; color: #fff;">Member Authentication Required</h3>
      <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 320px; line-height: 1.5;">
        To secure seat maps, execute payments, and store active ticket boards, please sign up or log in.
      </p>
      
      <div class="auth-cta-container">
        <a href="login.html" class="auth-btn-main">Log In</a>
        <a href="signup.html" class="auth-btn-alt">Create Account</a>
      </div>
    </div>
  `;

  authModal.classList.add("active");
}

// --- SEAT BOOKING SYSTEM & COACH MAP BUILDER ---
function triggerSeatSelectionModal(train) {
  activeBooking.train = train;
  activeBooking.selectedSeats = [];
  activeBooking.passengers = [];
  
  const modal = document.getElementById("seat-map-modal");
  const modalBody = modal.querySelector(".modal-body");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="seat-map-grid-container">
      <div>
        <div class="coach-layout-box">
          <div class="coach-header-label">Coach Sleeper Grid - Compartment S3</div>
          <div class="coach-seats-grid" id="coach-seats-grid"></div>
          <div class="seats-legend">
            <div class="legend-item"><span class="legend-color avail"></span><span>Available</span></div>
            <div class="legend-item"><span class="legend-color sel"></span><span>Selected</span></div>
            <div class="legend-item"><span class="legend-color bk"></span><span>Booked</span></div>
          </div>
        </div>
      </div>
      
      <div class="booking-form-box">
        <div style="border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">
          <h3 style="font-family: var(--font-headings); font-size: 1.15rem; color: #fff;">Selected Class: ${activeBooking.selectedClass}</h3>
          <p style="font-size: 0.75rem; color: var(--text-secondary);">Fare multiplier configured for this class choice.</p>
        </div>

        <div class="booking-summary-card">
          <div class="summary-row">
            <span class="summary-label">Train Name</span>
            <span class="summary-value">${train.trainName}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Class Selected</span>
            <span class="summary-value">${activeBooking.selectedClass}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Date of Journey</span>
            <span class="summary-value">${activeBooking.journeyDate || new Date().toISOString().split('T')[0]}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Base Seat Price</span>
            <span class="summary-value">₹${getClassMultiplierFare(train.fare, activeBooking.selectedClass)}</span>
          </div>
          <div class="summary-row" style="border-top: 1px dashed var(--border-glass); padding-top: 0.5rem; margin-top: 0.5rem;">
            <span class="summary-label">Selected Seats</span>
            <span class="summary-value" id="summary-seats-list" style="color: var(--accent-cyan); font-weight: 700;">None</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Total Cost</span>
            <span class="summary-value total" id="summary-total-price">₹0</span>
          </div>
        </div>

        <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700; margin-top: 0.5rem;">Passenger Details</h4>
        <div class="passenger-inputs-wrap" id="passenger-inputs-wrap">
          <p style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">Select seats inside the virtual coach to add passenger details...</p>
        </div>

        <button class="confirm-booking-btn" id="confirm-booking-btn" disabled>
          <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          <span>Confirm Booking</span>
        </button>
      </div>
    </div>
  `;

  const seatGrid = document.getElementById("coach-seats-grid");
  const berths = ["LB", "MB", "UB", "SL", "SU"];
  
  for (let sNum = 1; sNum <= 24; sNum++) {
    if ((sNum - 1) % 4 === 2) {
      const aisle = document.createElement("div");
      aisle.className = "aisle-space";
      seatGrid.appendChild(aisle);
    }

    const seat = document.createElement("div");
    const berthName = berths[(sNum - 1) % berths.length];
    const isBooked = (sNum * 7) % 10 < 3;
    
    seat.className = `seat ${isBooked ? 'booked' : ''}`;
    seat.innerHTML = `
      <span class="seat-num">${sNum}</span>
      <span class="seat-berth">${berthName}</span>
    `;

    if (!isBooked) {
      seat.addEventListener("click", () => {
        toggleSeatSelection(sNum, berthName, seat);
      });
    }

    seatGrid.appendChild(seat);
  }

  document.getElementById("confirm-booking-btn").addEventListener("click", () => {
    initiatePaymentModal();
  });

  modal.classList.add("active");
}

function getClassMultiplierFare(baseFare, travelClass) {
  let multiplier = 1.0;
  if (travelClass === "1A") multiplier = 2.4;
  else if (travelClass === "2A") multiplier = 1.6;
  else if (travelClass === "3A") multiplier = 1.25;
  else if (travelClass === "CC") multiplier = 1.1;
  else if (travelClass === "SL") multiplier = 0.6;
  return Math.round(baseFare * multiplier);
}

function toggleSeatSelection(seatNum, berthName, element) {
  const index = activeBooking.selectedSeats.findIndex(s => s.num === seatNum);

  if (index >= 0) {
    activeBooking.selectedSeats.splice(index, 1);
    element.classList.remove("selected");
  } else {
    if (activeBooking.selectedSeats.length >= 6) {
      alert("Passenger booking limit reached: Maximum 6 seats per transaction.");
      return;
    }
    activeBooking.selectedSeats.push({ num: seatNum, berth: berthName });
    element.classList.add("selected");
  }

  updateBookingSummaries();
}

function updateBookingSummaries() {
  const seatsListText = document.getElementById("summary-seats-list");
  const totalPriceText = document.getElementById("summary-total-price");
  const inputsContainer = document.getElementById("passenger-inputs-wrap");
  const submitBtn = document.getElementById("confirm-booking-btn");

  if (activeBooking.selectedSeats.length === 0) {
    seatsListText.textContent = "None";
    totalPriceText.textContent = "₹0";
    inputsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">Select seats inside the virtual coach to add passenger details...</p>`;
    submitBtn.disabled = true;
    return;
  }

  const sorted = [...activeBooking.selectedSeats].sort((a, b) => a.num - b.num);
  seatsListText.textContent = sorted.map(s => `${s.num} (${s.berth})`).join(", ");
  
  const perSeatFare = getClassMultiplierFare(activeBooking.train.fare, activeBooking.selectedClass);
  const totalCost = perSeatFare * activeBooking.selectedSeats.length;
  totalPriceText.textContent = `₹${totalCost}`;

  inputsContainer.innerHTML = "";
  sorted.forEach((seat, idx) => {
    const row = document.createElement("div");
    row.className = "passenger-row";
    row.innerHTML = `
      <input type="text" placeholder="Passenger ${idx + 1} Name (Seat ${seat.num})" id="pass-name-${seat.num}" required />
      <input type="number" placeholder="Age" min="1" max="120" id="pass-age-${seat.num}" required />
    `;
    inputsContainer.appendChild(row);
  });

  submitBtn.disabled = false;
}

// --- SIMULATED PAYMENT GATEWAY TERMINAL ---
function initiatePaymentModal() {
  const passRows = document.querySelectorAll(".passenger-row");
  const passengers = [];
  let valid = true;

  activeBooking.selectedSeats.forEach(seat => {
    const nameInput = document.getElementById(`pass-name-${seat.num}`);
    const ageInput = document.getElementById(`pass-age-${seat.num}`);
    
    if (nameInput && ageInput) {
      const name = nameInput.value.trim();
      const age = ageInput.value.trim();
      
      if (!name || !age) {
        valid = false;
        nameInput.style.borderColor = "var(--status-booked)";
      } else {
        passengers.push({
          name: name,
          age: age,
          seat: seat.num,
          berth: seat.berth
        });
      }
    }
  });

  if (!valid) {
    alert("Please enter full details for all passengers matching the selected coach seats.");
    return;
  }

  activeBooking.passengers = passengers;

  // Close Coach Map Modal
  document.getElementById("seat-map-modal").classList.remove("active");

  const payModal = document.getElementById("payment-modal");
  const modalBody = payModal.querySelector(".modal-body");
  if (!payModal || !modalBody) return;

  const perSeatFare = getClassMultiplierFare(activeBooking.train.fare, activeBooking.selectedClass);
  const totalCost = perSeatFare * activeBooking.selectedSeats.length;

  modalBody.innerHTML = `
    <div class="payment-tabs">
      <button class="payment-tab-btn active" id="tab-card">Credit/Debit Card</button>
      <button class="payment-tab-btn" id="tab-upi">UPI Scan Payment</button>
    </div>

    <!-- MAIN FORM CONTAINER -->
    <div id="payment-method-container">
      <!-- Card Panel Form -->
      <div id="card-payment-panel">
        <div class="payment-card-visual">
          <div class="card-logo-row">
            <div class="card-chip"></div>
            <div id="visual-card-brand" style="font-family: var(--font-headings); font-weight: 800; font-size: 1.1rem; font-style: italic; color: #fff;">VISA</div>
          </div>
          <div class="card-number-visual" id="visual-card-number">•••• •••• •••• ••••</div>
          <div class="card-details-row">
            <div>
              <div style="font-size: 0.5rem; opacity: 0.6;">Card Holder</div>
              <div id="visual-card-name" style="font-weight: 600;">YOUR NAME</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.5rem; opacity: 0.6;">Expires</div>
              <div id="visual-card-exp" style="font-weight: 600;">MM/YY</div>
            </div>
          </div>
        </div>

        <form id="card-pay-form" style="display:flex; flex-direction:column; gap:1rem;">
          <div class="input-group">
            <input type="text" id="card-num-input" placeholder=" " maxlength="19" required />
            <label for="card-num-input">Card Number</label>
          </div>
          <div class="input-group">
            <input type="text" id="card-name-input" placeholder=" " required />
            <label for="card-name-input">Cardholder Name</label>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="input-group">
              <input type="text" id="card-exp-input" placeholder=" " maxlength="5" required />
              <label for="card-exp-input">Expiry Date (MM/YY)</label>
            </div>
            <div class="input-group">
              <input type="password" id="card-cvv-input" placeholder=" " maxlength="3" required />
              <label for="card-cvv-input">CVV</label>
            </div>
          </div>
          <button type="submit" class="confirm-booking-btn" style="width:100%;">Pay ₹${totalCost}</button>
        </form>
      </div>
    </div>
  `;

  // Bind Card tab button actions
  const btnCard = document.getElementById("tab-card");
  const btnUpi = document.getElementById("tab-upi");
  
  if (btnCard && btnUpi) {
    btnCard.addEventListener("click", () => {
      btnCard.classList.add("active");
      btnUpi.classList.remove("active");
      showCardPaymentPanel(totalCost);
    });

    btnUpi.addEventListener("click", () => {
      btnUpi.classList.add("active");
      btnCard.classList.remove("active");
      showUpiPaymentPanel(totalCost);
    });
  }

  // Set up live card format input listener
  setupCardVisualSync();

  payModal.classList.add("active");
}

function showCardPaymentPanel(totalCost) {
  const container = document.getElementById("payment-method-container");
  container.innerHTML = `
    <div id="card-payment-panel">
      <div class="payment-card-visual">
        <div class="card-logo-row">
          <div class="card-chip"></div>
          <div id="visual-card-brand" style="font-family: var(--font-headings); font-weight: 800; font-size: 1.1rem; font-style: italic; color: #fff;">VISA</div>
        </div>
        <div class="card-number-visual" id="visual-card-number">•••• •••• •••• ••••</div>
        <div class="card-details-row">
          <div>
            <div style="font-size: 0.5rem; opacity: 0.6;">Card Holder</div>
            <div id="visual-card-name" style="font-weight: 600;">YOUR NAME</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.5rem; opacity: 0.6;">Expires</div>
            <div id="visual-card-exp" style="font-weight: 600;">MM/YY</div>
          </div>
        </div>
      </div>

      <form id="card-pay-form" style="display:flex; flex-direction:column; gap:1rem;">
        <div class="input-group">
          <input type="text" id="card-num-input" placeholder=" " maxlength="19" required />
          <label for="card-num-input">Card Number</label>
        </div>
        <div class="input-group">
          <input type="text" id="card-name-input" placeholder=" " required />
          <label for="card-name-input">Cardholder Name</label>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="input-group">
            <input type="text" id="card-exp-input" placeholder=" " maxlength="5" required />
            <label for="card-exp-input">Expiry Date (MM/YY)</label>
          </div>
          <div class="input-group">
            <input type="password" id="card-cvv-input" placeholder=" " maxlength="3" required />
            <label for="card-cvv-input">CVV</label>
          </div>
        </div>
        <button type="submit" class="confirm-booking-btn" style="width:100%;">Pay ₹${totalCost}</button>
      </form>
    </div>
  `;
  setupCardVisualSync();
}

function setupCardVisualSync() {
  const cardNum = document.getElementById("card-num-input");
  const cardName = document.getElementById("card-name-input");
  const cardExp = document.getElementById("card-exp-input");

  const vCardNum = document.getElementById("visual-card-number");
  const vCardName = document.getElementById("visual-card-name");
  const vCardExp = document.getElementById("visual-card-exp");
  const vCardBrand = document.getElementById("visual-card-brand");

  if (cardNum && vCardNum) {
    cardNum.addEventListener("input", (e) => {
      // Auto-space card numbers every 4 digits
      let value = cardNum.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formatted = "";
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += " ";
        formatted += value[i];
      }
      cardNum.value = formatted;

      vCardNum.textContent = formatted || "•••• •••• •••• ••••";
      
      // Determine card brand from first digit
      if (value.startsWith("4")) {
        vCardBrand.textContent = "VISA";
      } else if (value.startsWith("5")) {
        vCardBrand.textContent = "MASTERCARD";
      } else {
        vCardBrand.textContent = "CARD";
      }
    });
  }

  if (cardName && vCardName) {
    cardName.addEventListener("input", () => {
      vCardName.textContent = cardName.value.toUpperCase() || "YOUR NAME";
    });
  }

  if (cardExp && vCardExp) {
    cardExp.addEventListener("input", () => {
      let value = cardExp.value.replace(/[^0-9]/gi, '');
      if (value.length > 2) {
        cardExp.value = value.slice(0, 2) + "/" + value.slice(2, 4);
      } else {
        cardExp.value = value;
      }
      vCardExp.textContent = cardExp.value || "MM/YY";
    });
  }

  const form = document.getElementById("card-pay-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      executePaymentLoadingSequence();
    });
  }
}

function showUpiPaymentPanel(totalCost) {
  const container = document.getElementById("payment-method-container");
  container.innerHTML = `
    <div id="upi-payment-panel" style="text-align:center;">
      <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom: 1.5rem;">
        Scan the secure UPI QR code using BHIM, GPay, PhonePe or Paytm to finalize transaction.
      </p>

      <div class="upi-scan-box">
        <!-- SVG Vector QR Code -->
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="white"/>
          <rect x="5" y="5" width="25" height="25" fill="black"/>
          <rect x="9" y="9" width="17" height="17" fill="white"/>
          <rect x="13" y="13" width="9" height="9" fill="black"/>
          
          <rect x="70" y="5" width="25" height="25" fill="black"/>
          <rect x="74" y="9" width="17" height="17" fill="white"/>
          <rect x="78" y="13" width="9" height="9" fill="black"/>
          
          <rect x="5" y="70" width="25" height="25" fill="black"/>
          <rect x="9" y="74" width="17" height="17" fill="white"/>
          <rect x="13" y="78" width="9" height="9" fill="black"/>
          
          <rect x="75" y="75" width="10" height="10" fill="black"/>
          <rect x="78" y="78" width="4" height="4" fill="white"/>
          
          <!-- UPI QR grids details -->
          <rect x="35" y="10" width="4" height="4" fill="black"/>
          <rect x="42" y="5" width="8" height="4" fill="black"/>
          <rect x="55" y="12" width="4" height="8" fill="black"/>
          <rect x="38" y="25" width="12" height="4" fill="black"/>
          <rect x="10" y="35" width="4" height="8" fill="black"/>
          <rect x="25" y="42" width="8" height="4" fill="black"/>
          <rect x="5" y="55" width="8" height="4" fill="black"/>
          <rect x="35" y="35" width="30" height="30" fill="black"/>
          <rect x="40" y="40" width="20" height="20" fill="white"/>
          <rect x="48" y="48" width="4" height="4" fill="black"/>
          <rect x="75" y="35" width="4" height="12" fill="black"/>
          <rect x="85" y="48" width="10" height="4" fill="black"/>
          <rect x="35" y="75" width="12" height="4" fill="black"/>
          <rect x="50" y="85" width="4" height="10" fill="black"/>
          <rect x="68" y="68" width="4" height="4" fill="black"/>
          <rect x="90" y="90" width="6" height="6" fill="black"/>
        </svg>
      </div>

      <div style="font-family: var(--font-headings); font-size:1.15rem; font-weight:700; color:#fff; margin-bottom: 1.5rem;">
        Total: ₹${totalCost}
      </div>

      <p style="color:var(--status-available); font-size:0.85rem; font-weight:600; animation: pulseGlow 1.2s infinite alternate;">
        Waiting for UPI payment verification signals...
      </p>

      <button id="mock-upi-pay-trigger" class="confirm-booking-btn" style="width:100%; margin-top:1.5rem;">Simulate QR Scan Success</button>
    </div>
  `;

  document.getElementById("mock-upi-pay-trigger").addEventListener("click", () => {
    executePaymentLoadingSequence();
  });
}

function executePaymentLoadingSequence() {
  const payModal = document.getElementById("payment-modal");
  const modalBody = payModal.querySelector(".modal-body");
  if (!modalBody) return;

  // Show dynamic loaderspinner
  modalBody.innerHTML = `
    <div class="payment-loading">
      <div class="payment-spinner"></div>
      <div>
        <h3 style="font-family: var(--font-headings); font-size:1.25rem; color:#fff; margin-bottom:0.5rem;">Verifying Secure Transaction</h3>
        <p style="color:var(--text-secondary); font-size:0.9rem; max-width: 250px;">Authorizing credentials and querying banking gateway API...</p>
      </div>
    </div>
  `;

  setTimeout(() => {
    // Show success checkmark animation
    modalBody.innerHTML = `
      <div class="payment-loading" style="gap:1rem;">
        <div class="success-checkmark">
          <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <div>
          <h3 style="font-family: var(--font-headings); font-size:1.35rem; color:var(--status-available); margin-bottom:0.25rem;">Payment Successful</h3>
          <p style="color:var(--text-secondary); font-size:0.85rem;">Ticket details pushed to database. Compiling e-Ticket...</p>
        </div>
      </div>
    `;

    setTimeout(() => {
      // Hide Payment Modal
      payModal.classList.remove("active");
      
      // Compile final ticket details and push to database
      saveAndGenerateTicket();
    }, 1200);

  }, 1800);
}

// --- BOOKING SAVE & PERSISTENCE LAYER ---
function saveAndGenerateTicket() {
  const username = localStorage.getItem("username");
  const pnr = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
  
  const perSeatFare = getClassMultiplierFare(activeBooking.train.fare, activeBooking.selectedClass);
  const totalCost = perSeatFare * activeBooking.selectedSeats.length;

  const ticketObj = {
    pnr: pnr,
    trainName: activeBooking.train.trainName,
    from: activeBooking.train.from,
    to: activeBooking.train.to,
    departure: activeBooking.train.departure,
    arrival: activeBooking.train.arrival,
    classSelected: activeBooking.selectedClass,
    journeyDate: activeBooking.journeyDate || new Date().toISOString().split('T')[0],
    totalCost: totalCost,
    passengers: activeBooking.passengers
  };

  if (username) {
    const key = `bookings_${username}`;
    const userBookings = JSON.parse(localStorage.getItem(key)) || [];
    userBookings.unshift(ticketObj);
    localStorage.setItem(key, JSON.stringify(userBookings));
  }

  // Trigger Ticket confirmation modal
  triggerTicketConfirmationModal(pnr);
}

function triggerTicketConfirmationModal(pnr) {
  const ticketModal = document.getElementById("ticket-modal");
  const modalBody = ticketModal.querySelector(".modal-body");
  if (!ticketModal || !modalBody) return;

  const train = activeBooking.train;
  const perSeatFare = getClassMultiplierFare(train.fare, activeBooking.selectedClass);
  const totalCost = perSeatFare * activeBooking.selectedSeats.length;

  modalBody.innerHTML = `
    <div class="ticket-wrapper" id="ticket-wrapper">
      <div class="ticket-divider"></div>
      
      <div class="ticket-grid">
        <div class="ticket-main-section">
          <div class="ticket-logo-header">
            <div class="ticket-logo">INDIAN RAILWAYS</div>
            <span class="ticket-badge">CONFIRMED</span>
          </div>

          <div style="border-top: 1px solid var(--border-glass); border-bottom: 1px solid var(--border-glass); padding: 0.75rem 0; margin: 0.25rem 0;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Train Info</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #fff; font-family: var(--font-headings);">${train.trainName}</div>
          </div>

          <div class="ticket-details-grid">
            <div class="ticket-detail-item">
              <label>From</label>
              <span>${train.from}</span>
            </div>
            <div class="ticket-detail-item" style="text-align: center;">
              <label>Journey Date</label>
              <span>${activeBooking.journeyDate || new Date().toISOString().split('T')[0]}</span>
            </div>
            <div class="ticket-detail-item" style="text-align: right;">
              <label>To</label>
              <span>${train.to}</span>
            </div>
            
            <div class="ticket-detail-item">
              <label>Departure</label>
              <span>${train.departure}</span>
            </div>
            <div class="ticket-detail-item" style="text-align: center;">
              <label>Class</label>
              <span>${activeBooking.selectedClass}</span>
            </div>
            <div class="ticket-detail-item" style="text-align: right;">
              <label>Arrival</label>
              <span>${train.arrival}</span>
            </div>
          </div>

          <div class="ticket-passengers-list">
            <h4>Passenger details (Coach S3)</h4>
            ${activeBooking.passengers.map(p => `
              <div class="ticket-pass-row">
                <span><strong>${p.name}</strong> (Age: ${p.age})</span>
                <span style="color: var(--accent-cyan); font-weight: 600;">Seat ${p.seat} [${p.berth}]</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="ticket-coupon-section">
          <div class="ticket-qr-code">
            <svg viewBox="0 0 100 100" width="110" height="110">
              <rect width="100" height="100" fill="white"/>
              <rect x="5" y="5" width="25" height="25" fill="black"/>
              <rect x="9" y="9" width="17" height="17" fill="white"/>
              <rect x="13" y="13" width="9" height="9" fill="black"/>
              
              <rect x="70" y="5" width="25" height="25" fill="black"/>
              <rect x="74" y="9" width="17" height="17" fill="white"/>
              <rect x="78" y="13" width="9" height="9" fill="black"/>
              
              <rect x="5" y="70" width="25" height="25" fill="black"/>
              <rect x="9" y="74" width="17" height="17" fill="white"/>
              <rect x="13" y="78" width="9" height="9" fill="black"/>
              
              <rect x="75" y="75" width="10" height="10" fill="black"/>
              <rect x="78" y="78" width="4" height="4" fill="white"/>
              
              <rect x="35" y="10" width="4" height="4" fill="black"/>
              <rect x="42" y="5" width="8" height="4" fill="black"/>
              <rect x="55" y="12" width="4" height="8" fill="black"/>
              <rect x="38" y="25" width="12" height="4" fill="black"/>
              <rect x="10" y="35" width="4" height="8" fill="black"/>
              <rect x="25" y="42" width="8" height="4" fill="black"/>
              <rect x="5" y="55" width="8" height="4" fill="black"/>
              
              <rect x="35" y="35" width="30" height="30" fill="black"/>
              <rect x="40" y="40" width="20" height="20" fill="white"/>
              <rect x="48" y="48" width="4" height="4" fill="black"/>
              
              <rect x="75" y="35" width="4" height="12" fill="black"/>
              <rect x="85" y="48" width="10" height="4" fill="black"/>
              <rect x="35" y="75" width="12" height="4" fill="black"/>
              <rect x="50" y="85" width="4" height="10" fill="black"/>
              <rect x="68" y="68" width="4" height="4" fill="black"/>
              <rect x="90" y="90" width="6" height="6" fill="black"/>
            </svg>
          </div>
          
          <div class="ticket-pnr-box">
            <label>Booking PNR</label>
            <span>${pnr}</span>
          </div>

          <div style="border-top: 1px solid var(--border-glass); padding-top: 0.5rem; width: 100%;">
            <label style="font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase;">Total Transacted</label>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-headings);">₹${totalCost}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="ticket-actions-btn">
      <button class="ticket-action" onclick="window.print()">
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
        <span>Print Ticket</span>
      </button>
      <button class="ticket-action" id="close-ticket-btn">
        <span>Close & View Dashboard</span>
      </button>
    </div>
  `;

  document.getElementById("close-ticket-btn").addEventListener("click", () => {
    ticketModal.classList.remove("active");
    triggerDashboardView();
  });

  ticketModal.classList.add("active");
}

// --- PERSISTENT USER BOOKING HISTORY DASHBOARD ("MY BOOKINGS") ---
function triggerDashboardView() {
  const mainSearchSection = document.querySelector(".search-section");
  const resultsSection = document.getElementById("results-section");
  const mainContainer = document.querySelector("main");
  const navHome = document.getElementById("nav-home");
  const navDashboard = document.getElementById("nav-dashboard");

  if (!mainContainer) return;

  // Toggle Navbar Active
  if (navHome) navHome.parentElement.classList.remove("active");
  if (navDashboard) navDashboard.parentElement.classList.add("active");

  // Hide Search elements
  if (mainSearchSection) mainSearchSection.style.display = "none";
  if (resultsSection) resultsSection.style.display = "none";

  // Remove old dashboard container if exists
  const oldDashboard = document.getElementById("dashboard-container");
  if (oldDashboard) oldDashboard.remove();

  // Create active Dashboard section
  const dashboard = document.createElement("div");
  dashboard.id = "dashboard-container";
  dashboard.className = "dashboard-section";

  const username = localStorage.getItem("username");
  const key = `bookings_${username}`;
  const bookings = JSON.parse(localStorage.getItem(key)) || [];

  dashboard.innerHTML = `
    <div style="border-bottom:1px solid var(--border-glass); padding-bottom: 1rem; margin-bottom: 1rem;">
      <h1 style="font-family: var(--font-headings); font-weight:800; font-size:2.4rem; background: linear-gradient(135deg, #fff, var(--accent-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Your Travel Dashboard</h1>
      <p style="color:var(--text-secondary); font-size:0.95rem;">Review active ticket histories, cancel reservations, or live track active train positions.</p>
    </div>

    <div id="dashboard-tickets-list" style="display:flex; flex-direction:column; gap:1.75rem;">
      <!-- Dashboard tickets populate here -->
    </div>
  `;

  mainContainer.appendChild(dashboard);
  renderDashboardTickets(bookings, username);
}

function renderDashboardTickets(bookings, username) {
  const container = document.getElementById("dashboard-tickets-list");
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = `
      <div style="background: var(--bg-dark-card); border: 1px dashed var(--border-glass); border-radius: var(--radius-lg); padding: 4rem 2rem; text-align: center;">
        <svg width="60" height="60" fill="var(--text-muted)" viewBox="0 0 24 24" style="margin-bottom: 1rem;"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
        <h3 style="font-family: var(--font-headings); font-size:1.5rem; color:#fff; margin-bottom:0.5rem;">No Active Bookings</h3>
        <p style="color:var(--text-secondary); font-size:0.9rem; max-width: 400px; margin: 0 auto 1.5rem;">You haven't reserved any journeys on RailPass yet. Head back to the search portal to book train coach tickets.</p>
        <button class="search-btn" id="dash-book-now-btn" style="margin: 0 auto; padding: 0.8rem 2.5rem; font-size:1rem;">Book A Journey</button>
      </div>
    `;
    
    document.getElementById("dash-book-now-btn").addEventListener("click", () => {
      const navHome = document.getElementById("nav-home");
      if (navHome) navHome.click();
    });
    return;
  }

  bookings.forEach((ticket, index) => {
    const card = document.createElement("div");
    card.className = "ticket-dashboard-card";
    
    card.innerHTML = `
      <div class="dash-card-header">
        <div>
          <span class="pnr-tag-label">PNR Identifier</span>
          <div class="pnr-tag-value">${ticket.pnr}</div>
        </div>
        <div style="display:flex; gap:1rem; align-items:center;">
          <button class="ticket-action" style="padding: 0.4rem 1rem; font-size:0.8rem;" id="track-btn-${ticket.pnr}">Track Train</button>
          <button class="cancel-booking-btn" id="cancel-btn-${ticket.pnr}">Cancel Ticket</button>
        </div>
      </div>

      <div class="ticket-grid" style="grid-template-columns: 2.2fr 0.8fr; gap:1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1.25rem;">
        <div>
          <h3 style="font-family: var(--font-headings); font-size:1.15rem; color:#fff; margin-bottom: 1rem;">${ticket.trainName}</h3>
          
          <div class="ticket-details-grid" style="grid-template-columns: repeat(3, 1fr); gap:1rem; margin-bottom: 1rem;">
            <div class="ticket-detail-item"><label>From</label><span>${ticket.from}</span></div>
            <div class="ticket-detail-item" style="text-align: center;"><label>Date</label><span>${ticket.journeyDate}</span></div>
            <div class="ticket-detail-item" style="text-align: right;"><label>To</label><span>${ticket.to}</span></div>
            <div class="ticket-detail-item"><label>Departure</label><span>${ticket.departure}</span></div>
            <div class="ticket-detail-item" style="text-align: center;"><label>Class</label><span>${ticket.classSelected}</span></div>
            <div class="ticket-detail-item" style="text-align: right;"><label>Arrival</label><span>${ticket.arrival}</span></div>
          </div>

          <div class="ticket-passengers-list">
            <h4 style="font-size:0.7rem; color:var(--text-muted);">PASSENGER COUPE SCHEDULING (Coach S3)</h4>
            ${ticket.passengers.map(p => `
              <div class="ticket-pass-row" style="font-size:0.8rem;">
                <span><strong>${p.name}</strong> (Age: ${p.age})</span>
                <span style="color:var(--accent-cyan); font-weight:600;">Seat ${p.seat} [${p.berth}]</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; background: rgba(255,255,255,0.01); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:1rem;">
          <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">Transacted Fare</div>
          <div style="font-size:1.6rem; font-weight:800; color:var(--accent-cyan); font-family: var(--font-headings); margin-top:0.25rem;">₹${ticket.totalCost}</div>
          <div style="font-size:0.6rem; color:var(--status-available); font-weight:700; margin-top:0.5rem; background:rgba(16,185,129,0.1); padding: 0.1rem 0.5rem; border-radius:10px;">CREDIT CARD</div>
        </div>
      </div>

      <!-- Live GPS Tracker Container -->
      <div id="live-tracker-box-${ticket.pnr}" style="display:none;"></div>
    `;

    // Bind Cancellation Logic
    card.querySelector(`#cancel-btn-${ticket.pnr}`).addEventListener("click", () => {
      triggerTicketCancellation(ticket.pnr, ticket.totalCost, username);
    });

    // Bind Track Live Train Logic
    card.querySelector(`#track-btn-${ticket.pnr}`).addEventListener("click", () => {
      toggleLiveGpsTracker(ticket.pnr, ticket.from, ticket.to);
    });

    container.appendChild(card);
  });
}

// --- DYNAMIC REFUND & TICKET CANCELLATION ENGINE ---
function triggerTicketCancellation(pnr, totalCost, username) {
  const penalty = Math.round(totalCost * 0.25); // 25% Cancellation penalty fee
  const refundAmount = totalCost - penalty;

  const confirmation = confirm(`Cancellation Policy warning:
- A 25% administrative fee (₹${penalty}) will be deducted.
- Total Refundable Credit: ₹${refundAmount}.
- Seat Coach assets will be released back to system.

Do you wish to confirm cancellation of PNR: ${pnr}?`);

  if (confirmation) {
    const key = `bookings_${username}`;
    const userBookings = JSON.parse(localStorage.getItem(key)) || [];
    
    // Filter out canceled ticket
    const updated = userBookings.filter(t => t.pnr !== pnr);
    localStorage.setItem(key, JSON.stringify(updated));

    alert(`Ticket Cancelled Successful!
Refund of ₹${refundAmount} has been credited back to your transacted source account. PNR ${pnr} released.`);
    
    // Refresh dashboard view
    triggerDashboardView();
  }
}

// --- INTERACTIVE GPS LIVE TRAIN TRACKER ---
function toggleLiveGpsTracker(pnr, from, to) {
  const trackerBox = document.getElementById(`live-tracker-box-${pnr}`);
  if (!trackerBox) return;

  if (trackerBox.style.display === "block") {
    trackerBox.style.display = "none";
    return;
  }

  // Compile Route station steps
  const routeKey = `${from}-${to}`;
  const reverseRouteKey = `${to}-${from}`;
  let routeList = ["Delhi", "Agra", "Jaipur", "Bengaluru"]; // Default fallback
  
  if (routesGPS[routeKey]) {
    routeList = routesGPS[routeKey];
  } else if (routesGPS[reverseRouteKey]) {
    routeList = [...routesGPS[reverseRouteKey]].reverse();
  } else {
    // Generate simple custom route
    routeList = [from, "Aesthetic Junction", "Central Hub", to];
  }

  trackerBox.innerHTML = `
    <div class="live-tracker-widget">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h4 style="font-family: var(--font-headings); font-size:0.95rem; color:#fff;">Live Train GPS Position Map</h4>
        <span class="tracking-gps-pill" style="font-size:0.7rem; font-weight:700; color:var(--status-available);">GPS SATELLITE ACTIVE</span>
      </div>

      <div class="tracker-timeline">
        <div class="tracker-progress-overlay" id="tracker-progress-${pnr}" style="width: 0%;"></div>
        ${routeList.map((station, idx) => `
          <div class="tracker-node" id="node-${pnr}-${idx}">
            <div class="tracker-dot"></div>
            <span class="tracker-station-name">${station}</span>
          </div>
        `).join('')}
      </div>

      <div class="tracker-info-row">
        <div class="tracker-meta-item">
          <label>Train Status</label>
          <span style="color:var(--status-available);" id="tracker-status-text-${pnr}">On Time</span>
        </div>
        <div class="tracker-meta-item">
          <label>Speedometer</label>
          <span id="tracker-speed-${pnr}">0 km/h</span>
        </div>
        <div class="tracker-meta-item">
          <label>Delay Pill</label>
          <span id="tracker-delay-${pnr}">0m</span>
        </div>
        <div class="tracker-meta-item">
          <label>Transit ETA</label>
          <span id="tracker-eta-${pnr}">Calculating...</span>
        </div>
      </div>
    </div>
  `;

  trackerBox.style.display = "block";

  // Trigger slow incremental route progress animation
  animateGpsTrackerProgress(pnr, routeList.length);
}

function animateGpsTrackerProgress(pnr, nodeCount) {
  const progressBar = document.getElementById(`tracker-progress-${pnr}`);
  const speedText = document.getElementById(`tracker-speed-${pnr}`);
  const delayText = document.getElementById(`tracker-delay-${pnr}`);
  const statusText = document.getElementById(`tracker-status-text-${pnr}`);
  const etaText = document.getElementById(`tracker-eta-${pnr}`);

  if (!progressBar) return;

  let progressPercent = 0;
  let activeNode = 0;

  // Visual increments
  const interval = setInterval(() => {
    // Check if element is still visible or closed in DOM
    const checking = document.getElementById(`tracker-progress-${pnr}`);
    if (!checking || checking.style.display === "none") {
      clearInterval(interval);
      return;
    }

    progressPercent += 1;
    progressBar.style.width = `${progressPercent}%`;

    // Map progress percent to active node states
    const nodeSpan = 100 / (nodeCount - 1);
    const currentNode = Math.floor(progressPercent / nodeSpan);
    
    if (currentNode !== activeNode) {
      activeNode = currentNode;
    }

    // Color completed route nodes
    for (let i = 0; i < nodeCount; i++) {
      const nodeEl = document.getElementById(`node-${pnr}-${i}`);
      if (nodeEl) {
        if (i < activeNode) {
          nodeEl.className = "tracker-node completed";
        } else if (i === activeNode) {
          nodeEl.className = "tracker-node active";
        } else {
          nodeEl.className = "tracker-node";
        }
      }
    }

    // Dynamic speeds & ETAs
    const baseSpeed = 100 + (progressPercent * 2) % 35;
    speedText.textContent = `${baseSpeed} km/h`;
    
    const minutesLeft = Math.max(0, 180 - Math.round(progressPercent * 1.8));
    etaText.textContent = minutesLeft > 0 ? `${minutesLeft} mins` : "Arrived at Junction";

    if (progressPercent >= 50 && progressPercent < 80) {
      statusText.textContent = "Minor Delay";
      statusText.style.color = "var(--status-waiting)";
      delayText.textContent = "12m";
    } else if (progressPercent >= 80) {
      statusText.textContent = "Recovered Delay";
      statusText.style.color = "var(--status-available)";
      delayText.textContent = "3m";
    } else {
      statusText.textContent = "On Time";
      statusText.style.color = "var(--status-available)";
      delayText.textContent = "0m";
    }

    if (progressPercent >= 100) {
      clearInterval(interval);
      // Mark final node completed
      const finalNode = document.getElementById(`node-${pnr}-${nodeCount - 1}`);
      if (finalNode) finalNode.className = "tracker-node completed";
      speedText.textContent = "0 km/h";
      statusText.textContent = "Journey Completed";
    }
  }, 100);
}

// --- MODAL BACKDROP SYSTEM ---
function setupModalEvents() {
  const modals = document.querySelectorAll(".modal-overlay");
  modals.forEach(modal => {
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
      });
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });
}

// --- DYNAMIC ACCORDION FAQS SYSTEM (train.html) ---
function setupFaqAccordion() {
  const accordionItems = document.querySelectorAll(".accordion-item");
  accordionItems.forEach(item => {
    const header = item.querySelector(".accordion-header");
    if (header) {
      header.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        accordionItems.forEach(sib => sib.classList.remove("active"));
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });
}
