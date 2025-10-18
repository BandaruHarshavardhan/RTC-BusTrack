// Initialize Lucide Icons
lucide.createIcons();

// --- PAGE NAVIGATION LOGIC ---
const pageSearch = document.getElementById('page-search');
const pageSchedule = document.getElementById('page-schedule');

// --- State management for schedule page ---
let activeTab = 'general'; // Can be 'general' or 'upcoming'

// Function to show the main search page
function showSearchPage() {
    pageSearch.classList.remove('hidden');
    pageSchedule.classList.add('hidden');
    window.scrollTo(0, 0); // Scroll to top for a clean transition
}

// Function to show the schedule results page
function showSchedulePage(from, to) {
    pageSearch.classList.add('hidden');
    pageSchedule.classList.remove('hidden');
    
    const fromStationEl = document.getElementById('schedule-from-station');
    const toStationEl = document.getElementById('schedule-to-station');

    // Update station names if provided, otherwise use defaults
    fromStationEl.textContent = from || 'Service';
    toStationEl.textContent = to || 'Route';

    // --- Upcoming trips logic ---
    const allSchedules = mockSchedules; 
    const now = new Date();
    const upcomingSchedules = allSchedules.filter(s => {
        const [hours, minutes] = s.departure.split(':').map(Number);
        const tripTime = new Date();
        tripTime.setHours(hours, minutes, 0, 0);
        return tripTime > now;
    });

    const generalTab = document.getElementById('schedule-tab-general');
    const upcomingTab = document.getElementById('schedule-tab-upcoming');

    generalTab.textContent = `Schedule In General(${allSchedules.length})`;
    upcomingTab.textContent = `Upcoming Trips(${upcomingSchedules.length})`;

    // Reset active tab to general view on every new search
    activeTab = 'general';
    generalTab.classList.add('border-white', 'font-semibold');
    generalTab.classList.remove('text-gray-300', 'font-medium');
    upcomingTab.classList.remove('border-white', 'font-semibold');
    upcomingTab.classList.add('text-gray-300', 'font-medium');

    generateScheduleCards(from, to); // Regenerate cards with the correct route
    window.scrollTo(0, 0); // Scroll to top for a clean transition
}

// Initially show the search page
showSearchPage();

// 1. Dark Mode Toggle Logic
const darkModeToggle = document.getElementById('dark-mode-toggle');
const modeIcon = document.getElementById('mode-icon');
const appBody = document.documentElement;

function updateIcon(isDark) {
    if (isDark) {
        modeIcon.setAttribute('data-lucide', 'moon');
        darkModeToggle.querySelector('span').textContent = 'Light Mode';
    } else {
        modeIcon.setAttribute('data-lucide', 'sun');
        darkModeToggle.querySelector('span').textContent = 'Dark Mode';
    }
    lucide.createIcons();
}

const savedMode = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedMode === 'dark' || (!savedMode && prefersDark)) {
    appBody.classList.add('dark');
    updateIcon(true);
} else {
    updateIcon(false);
}

darkModeToggle.addEventListener('click', () => {
    if (appBody.classList.contains('dark')) {
        appBody.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateIcon(false);
    } else {
        appBody.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateIcon(true);
    }
});

// 2. Simulated Action/Notification Logic for non-redirect buttons
const notificationBox = document.getElementById('notification-box');
const notificationMessage = document.getElementById('notification-message');
let notificationTimeout;

function simulateAction(actionName, type = 'success') {
    clearTimeout(notificationTimeout);
    const icon = notificationBox.querySelector('i');
    const box = notificationBox.querySelector('div');

    notificationMessage.textContent = actionName;

    // Reset classes
    box.classList.remove('bg-violet-600', 'bg-red-500');
    
    if (type === 'error') {
        icon.setAttribute('data-lucide', 'x-circle');
        box.classList.add('bg-red-500');
    } else {
        icon.setAttribute('data-lucide', 'check-circle');
        box.classList.add('bg-violet-600');
    }
    lucide.createIcons(); // Re-render the icon

    // Show the box
    notificationBox.classList.remove('translate-x-full', 'opacity-0');
    notificationBox.classList.add('translate-x-0', 'opacity-100');

    // Hide the box after 3 seconds
    notificationTimeout = setTimeout(() => {
        notificationBox.classList.remove('translate-x-0', 'opacity-100');
        notificationBox.classList.add('translate-x-full', 'opacity-0');
    }, 3000);

    console.log(`User action: ${actionName}`);
}

// 3. Dynamic Data Setup

// Data for AP Bus Stops (used for location searches)
const apBusStopsDetailed = [
    { name: "Visakhapatnam", district: "Visakhapatnam", mandal: "Visakhapatnam (Urban)", pincode: "530001", state: "AP" },
    { name: "Vijayawada", district: "NTR", mandal: "Vijayawada (Urban)", pincode: "520001", state: "AP" },
    { name: "Guntur", district: "Guntur", mandal: "Guntur", pincode: "522001", state: "AP" },
    { name: "Nellore", district: "Nellore", mandal: "Nellore", pincode: "524001", state: "AP" },
    { name: "Kurnool", district: "Kurnool", mandal: "Kurnool", pincode: "518001", state: "AP" },
    { name: "Kakinada", district: "Kakinada", mandal: "Kakinada (Urban)", pincode: "533001", state: "AP" },
    { name: "Rajahmundry", district: "East Godavari", mandal: "Rajahmundry (Urban)", pincode: "533101", state: "AP" },
    { name: "Tirupati", district: "Tirupati", mandal: "Tirupati (Urban)", pincode: "517501", state: "AP" },
    { name: "Kadapa", district: "YSR Kadapa", mandal: "Kadapa", pincode: "516001", state: "AP" },
    { name: "Anantapur", district: "Anantapur", mandal: "Anantapur", pincode: "515001", state: "AP" },
    { name: "Vizianagaram", district: "Vizianagaram", mandal: "Vizianagaram", pincode: "535002", state: "AP" },
    { name: "Eluru", district: "Eluru", mandal: "Eluru", pincode: "534001", state: "AP" },
    { name: "Ongole", district: "Prakasam", mandal: "Ongole", pincode: "523001", state: "AP" },
    { name: "Machilipatnam", district: "Krishna", mandal: "Machilipatnam", pincode: "521001", state: "AP" },
    { name: "Srikakulam", district: "Srikakulam", mandal: "Srikakulam", pincode: "532001", state: "AP" },
    { name: "Chittoor", district: "Chittoor", mandal: "Chittoor", pincode: "517001", state: "AP" },
    { name: "Guntakal", district: "Anantapur", mandal: "Guntakal", pincode: "515801", state: "AP" },
    { name: "Proddatur", district: "YSR Kadapa", mandal: "Proddatur", pincode: "516360", state: "AP" },
    { name: "Bheemavaram", district: "West Godavari", mandal: "Bheemavaram", pincode: "534201", state: "AP" },
    { name: "Tadepalligudem", district: "West Godavari", mandal: "Tadepalligudem", pincode: "534101", state: "AP" },
    { name: "Vijayarai", district: "Eluru", mandal: "Pedavegi", pincode: "534475", state: "AP" }
];

// Data for AP Service Numbers and Names
const apServices = [
    { id: "S-101", name: "Indra Deluxe - Vizag to Vijayawada" },
    { id: "S-205", name: "Garuda Plus - Tirupati to Nellore" },
    { id: "S-312", name: "Amaravati - Guntur to Rajahmundry" },
    { id: "S-440", name: "Vennela - Anantapur to Kurnool" },
    { id: "S-509", name: "Express Non-Stop - Eluru to Kadapa" },
    { id: "S-611", name: "Super Luxury - Kakinada to Srikakulam" },
    { id: "S-789", name: "Metro Express - Vijayawada Local" },
    { id: "S-833", name: "Saptagiri - Tirupati to Chittoor" },
    { id: "S-900", name: "Express - Nellore to Visakhapatnam" },
    { id: "S-951", name: "City Rider - Guntur to Tenali" }
];

// Data: Mock AP Depot Locations
const apDepots = [
    "Vijayawada City Depot", "Visakhapatnam Depot 1", "Guntur RTC Complex",
    "Tirupati Central Depot", "Kurnool Main Depot", "Rajahmundry Division Depot",
    "Nellore Bus Station Depot", "Anantapur Depot", "Kadapa Central Depot",
    "Eluru Maintenance Depot"
];

// Function to populate location dropdowns
function populateSelect(selectId, optionsArray) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;

    optionsArray.forEach(stop => {
        const option = document.createElement('option');
        option.value = stop;
        option.textContent = stop;
        selectElement.appendChild(option);
    });
}

// Autocomplete functionality
function setupAutocomplete(inputId, suggestionsId, data) {
    const input = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsId);

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        suggestionsContainer.innerHTML = ''; // Clear old suggestions

        if (query.length === 0) {
            suggestionsContainer.classList.add('hidden');
            return;
        }

        const filteredStops = data.filter(stop => 
            stop.name.toLowerCase().includes(query)
        );

        if (filteredStops.length > 0) {
            filteredStops.forEach(stop => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.dataset.name = stop.name;
                item.innerHTML = `
                    <div class="suggestion-item-name">${stop.name.toUpperCase()}</div>
                    <div class="suggestion-item-details">
                        ${stop.district} (DT) ${stop.mandal} (MDL) - ${stop.pincode} ${stop.state}
                    </div>
                `;
                item.addEventListener('click', () => {
                    input.value = item.dataset.name;
                    suggestionsContainer.classList.add('hidden');
                });
                suggestionsContainer.appendChild(item);
            });
            suggestionsContainer.classList.remove('hidden');
        } else {
            suggestionsContainer.classList.add('hidden');
        }
    });

    // Add keydown listener for "Enter" key selection
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const isSuggestionsVisible = !suggestionsContainer.classList.contains('hidden');

            if (isSuggestionsVisible && suggestionsContainer.children.length > 0) {
                const firstSuggestion = suggestionsContainer.firstElementChild;
                input.value = firstSuggestion.dataset.name;
                suggestionsContainer.classList.add('hidden');
            }
        }
    });

    input.addEventListener('focus', () => {
        if(input.value.length > 0) {
            input.dispatchEvent(new Event('input'));
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!input.parentElement.contains(e.target)) {
            suggestionsContainer.classList.add('hidden');
        }
    });
}

// Handler for the first card search
function handleLocationSearch() {
    const fromStation = document.getElementById('from-station').value.trim();
    const toStation = document.getElementById('to-station').value.trim();

    if (!fromStation || !toStation) {
        simulateAction('Please select both stations.', 'error');
        return;
    }

    showSchedulePage(fromStation, toStation);
}

// Handler for the second card search
function handleServiceSearch() {
    const serviceNumber = document.getElementById('service-number').value;

    if (!serviceNumber) {
        simulateAction('Please select a service number.', 'error');
        return;
    }
    showSchedulePage(null, null);
}

// Handler for the third card search
function handleTimetableSearch() {
    const fromStation = document.getElementById('tt-from-station').value.trim();
    const toStation = document.getElementById('tt-to-station').value.trim();

    if (!fromStation || !toStation) {
        simulateAction('Please select both stations.', 'error');
        return;
    }

    showSchedulePage(fromStation, toStation);
}

// Function to populate service dropdown
function populateServiceSelect(selectId, servicesArray) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;

    servicesArray.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = `${service.id} - ${service.name}`;
        selectElement.appendChild(option);
    });
}

// Call population functions on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Card 1: Location Searches with Autocomplete
    setupAutocomplete('from-station', 'from-station-suggestions', apBusStopsDetailed);
    setupAutocomplete('to-station', 'to-station-suggestions', apBusStopsDetailed);
    populateServiceSelect('location-service', apServices);

    // Card 2: Service Search
    populateServiceSelect('service-number', apServices); 

    // Card 3: Timetable Search with Autocomplete
    setupAutocomplete('tt-from-station', 'tt-from-station-suggestions', apBusStopsDetailed);
    setupAutocomplete('tt-to-station', 'tt-to-station-suggestions', apBusStopsDetailed);
    populateSelect('tt-depot', apDepots);

    // --- Tab Switching Logic for Schedule Page ---
    const generalTab = document.getElementById('schedule-tab-general');
    const upcomingTab = document.getElementById('schedule-tab-upcoming');

    function setActiveTab(tab) {
        activeTab = tab;
        if (tab === 'general') {
            generalTab.classList.add('border-white', 'font-semibold');
            generalTab.classList.remove('text-gray-300', 'font-medium');
            upcomingTab.classList.remove('border-white', 'font-semibold');
            upcomingTab.classList.add('text-gray-300', 'font-medium');
        } else {
            upcomingTab.classList.add('border-white', 'font-semibold');
            upcomingTab.classList.remove('text-gray-300', 'font-medium');
            generalTab.classList.remove('border-white', 'font-semibold');
            generalTab.classList.add('text-gray-300', 'font-medium');
        }
        const fromStation = document.getElementById('schedule-from-station').textContent;
        const toStation = document.getElementById('schedule-to-station').textContent;
        generateScheduleCards(fromStation, toStation);
    }

    generalTab.addEventListener('click', () => setActiveTab('general'));
    upcomingTab.addEventListener('click', () => setActiveTab('upcoming'));
});

// 4. Schedule Page Dynamic Content Generation
const mockSchedules = [
    { id: "CD01/2", departure: "06:17", arrival: "08:10", depot: "STEEL CITY", type: "CITY ORDINARY" },
    { id: "CD02/2", departure: "17:30", arrival: "19:20", depot: "STEEL CITY", type: "EXPRESS" },
    { id: "CD03/2", departure: "18:15", arrival: "20:05", depot: "STEEL CITY", type: "SUPER LUXURY" },
    { id: "CD04/6", departure: "19:00", arrival: "20:45", depot: "GAJUWAKA", type: "CITY ORDINARY" },
    { id: "CD05/8", departure: "20:35", arrival: "22:25", depot: "GAJUWAKA", type: "EXPRESS" },
    { id: "CD06/1", departure: "21:10", arrival: "23:05", depot: "VIJAYAWADA", type: "SUPER LUXURY" }
];

function generateScheduleCard(schedule, from, to) {
    const routeText = (from && to) ? `${from.toUpperCase()} - ${to.toUpperCase()}` : 'Selected Route';
    
    let badgeText = schedule.type.replace('CITY ', '');
    let badgeClass = 'schedule-type-badge';
    if (badgeText === 'EXPRESS') {
        badgeClass += ' express';
    } else if (badgeText === 'SUPER LUXURY') {
        badgeClass += ' super-luxury';
    }

    return `
    <div class="bg-card rounded-lg shadow-md flex overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
        <div class="schedule-card-bar flex-shrink-0"></div>
        
        <div class="p-4 flex-grow flex justify-between items-center space-x-4">
            <div class="flex-grow">
                <div class="flex items-center space-x-2">
                    <i data-lucide="bus" class="w-5 h-5 text-violet-500"></i>
                    <span class="font-bold text-base text-primary">Service No : ${schedule.id}</span>
                </div>
                <p class="font-semibold text-lg text-gray-800 dark:text-gray-200 mt-1">${routeText}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Depot Name: ${schedule.depot}</p>
                
                <div class="flex space-x-8 mt-3 items-center">
                     <div class="text-xs text-gray-600 dark:text-gray-400">
                        <p>Schedule Departure</p>
                        <p>Schedule Arrival</p>
                    </div>
                    <div class="text-right font-mono font-semibold text-primary text-base">
                        <p>${schedule.departure}</p>
                        <p>${schedule.arrival}</p>
                    </div>
                </div>
            </div>

            <div class="flex flex-col items-end justify-between self-stretch text-right">
                <span class="${badgeClass}">${badgeText}</span>
                <i data-lucide="chevron-right" class="w-6 h-6 text-gray-400"></i>
            </div>
        </div>
    </div>
    `;
}

function generateScheduleCards(from, to) {
    const listContainer = document.getElementById('schedule-list');
    if (!listContainer) return;

    const now = new Date();
    const upcomingSchedules = mockSchedules.filter(s => {
        const [hours, minutes] = s.departure.split(':').map(Number);
        const tripTime = new Date();
        tripTime.setHours(hours, minutes, 0, 0);
        return tripTime > now;
    });

    const schedulesToRender = activeTab === 'general' ? mockSchedules : upcomingSchedules;

    if (schedulesToRender.length > 0) {
        listContainer.innerHTML = schedulesToRender.map(schedule => generateScheduleCard(schedule, from, to)).join('');
    } else {
         listContainer.innerHTML = `
            <div class="bg-card p-8 rounded-xl shadow-md text-center">
                <i data-lucide="bus-front" class="w-16 h-16 mx-auto text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-primary">No Upcoming Trips</h3>
                <p class="text-gray-500 dark:text-gray-400 mt-2">There are no more trips scheduled for this route today. Please check the general schedule for all timings.</p>
            </div>
        `;
    }
    lucide.createIcons();
}