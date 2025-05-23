// Gift list configuration
const gifts = [
	{
		id: 1,
		name: "Jogo de Panelas Antiaderente",
		image: "https://images.unsplash.com/photo-1588514899099-e2da695be5d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
		link: "https://exemplo.com/panelas"
	},
	{
		id: 2,
		name: "Máquina de Café Espresso",
		image: "https://images.unsplash.com/photo-1608355023747-0c82d7c25139?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
		link: "https://exemplo.com/cafe"
	},
	{
		id: 3,
		name: "Jogo de Toalhas de Banho",
		image: "https://images.unsplash.com/photo-1615874959474-df56644c8329?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
		link: "https://exemplo.com/toalhas"
	},
	{
		id: 4,
		name: "Air Fryer",
		image: "https://images.unsplash.com/photo-1617024542329-6ed5f6c7172e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
		link: "https://exemplo.com/airfryer"
	},
	{
		id: 5,
		name: "Jogo de Copos",
		image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
		link: "https://exemplo.com/copos"
	},
	{
		id: 6,
		name: "Vale-presente para Viagem",
		image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80",
		link: "https://exemplo.com/viagem"
	}
];

// Load gift reservations from localStorage
let giftReservations = JSON.parse(localStorage.getItem('giftReservations')) || {};

// Load guest list from localStorage
let rsvpList = JSON.parse(localStorage.getItem('rsvpList')) || [];

// Render gift list
const giftListContainer = document.getElementById('gift-list');

gifts.forEach(gift => {
	const isReserved = giftReservations[gift.id];
	
	const giftItem = document.createElement('div');
	giftItem.className = 'gift-item bg-white rounded-lg overflow-hidden shadow-md transition duration-300';
	giftItem.innerHTML = `
		<img src="${gift.image}" alt="${gift.name}" class="w-full h-48 object-cover">
		<div class="p-6">
			<h3 class="title-font text-xl mb-2">${gift.name}</h3>
			${isReserved ? 
				`<p class="text-green-600 mb-2">Reservado por ${isReserved.giverName}</p>
				 <button onclick="openModal(${gift.id})" class="mt-2 inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed" disabled>Presenteado</button>` :
				`<button onclick="openModal(${gift.id})" class="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition duration-300">Presentear</button>`
			}
		</div>
	`;
	giftListContainer.appendChild(giftItem);
});

// Render guest list
function renderGuestList() {
	const guestListContainer = document.getElementById('guest-list-container');
	guestListContainer.innerHTML = '';
	
	// Filter only guests who confirmed attendance
	const confirmedGuests = rsvpList;
	
	if (confirmedGuests.length === 0) {
		guestListContainer.innerHTML = `
			<div class="no-guests">
				<i class="fas fa-heart-broken text-4xl text-gray-400 mb-4"></i>
				<p>Ainda não temos confirmações. Seja o primeiro a confirmar!</p>
			</div>
		`;
		return;
	}
	
	confirmedGuests.forEach(guest => {
		const guestCard = document.createElement('div');
		guestCard.className = 'guest-card';
		
		// Randomly select an icon for variety
		const icons = ['fa-heart', 'fa-glass-cheers', 'fa-smile', 'fa-star', 'fa-gem'];
		const randomIcon = icons[Math.floor(Math.random() * icons.length)];
		
		// Format date
		const date = new Date(guest.date);
		const formattedDate = date.toLocaleDateString('pt-BR', { 
			day: '2-digit', 
			month: '2-digit', 
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
		
		guestCard.innerHTML = `
			<div class="guest-icon">
				<i class="fas ${randomIcon}"></i>
			</div>
			<h3 class="guest-name">${guest.name}</h3>
			<p class="guest-date">Confirmado em ${formattedDate}</p>
		`;
		
		guestListContainer.appendChild(guestCard);
	});
}

// Initial render of guest list
renderGuestList();

// Modal functions
function openModal(giftId) {
	document.getElementById('selected-gift').value = giftId;
	document.getElementById('gift-modal').style.display = 'flex';
}

function closeModal() {
	document.getElementById('gift-modal').style.display = 'none';
	document.getElementById('gift-form').reset();
}

// Gift form submission
document.getElementById('gift-form').addEventListener('submit', function(e) {
	e.preventDefault();
	
	const giftId = parseInt(document.getElementById('selected-gift').value);
	const giverName = document.getElementById('giver-name').value;
	
	// Save to localStorage
	giftReservations[giftId] = { giverName, date: new Date().toISOString() };
	localStorage.setItem('giftReservations', JSON.stringify(giftReservations));
	
	// Close modal and refresh gift list
	closeModal();
	
	// Refresh the gift list to show the reservation
	const giftButtons = document.querySelectorAll(`button[onclick="openModal(${giftId})"]`);
	giftButtons.forEach(button => {
		button.outerHTML = `
			<p class="text-green-600 mb-2">Reservado por ${giverName}</p>
			<button onclick="openModal(${giftId})" class="mt-2 inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed" disabled>Presenteado</button>
		`;
	});
});

// Countdown timer
const weddingDate = new Date('June 27, 2025 16:30:00').getTime();

function updateCountdown() {
	const now = new Date().getTime();
	const distance = weddingDate - now;
	
	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	document.getElementById('days').textContent = days.toString().padStart(2, '0');
	document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
	document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
	document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// RSVP Form submission
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
	e.preventDefault();
	
	const name = document.getElementById('name').value;
	
	// Save to localStorage
	rsvpList.push({ name, date: new Date().toISOString() });
	localStorage.setItem('rsvpList', JSON.stringify(rsvpList));
	
	// Refresh the guest list
	renderGuestList();
	
	// Reset form
	this.reset();
	
	// Scroll to guest list section
	document.getElementById('guests').scrollIntoView({ behavior: 'smooth' });
});

// Smooth scroll function
function smoothScroll(targetId) {
	const targetElement = document.getElementById(targetId);
	if (targetElement) {
		targetElement.scrollIntoView({
			behavior: 'smooth'
		});
	}
	
	// Prevent default anchor behavior
	return false;
}

// Welcome overlay and music functionality
document.addEventListener('DOMContentLoaded', function() {
	const welcomeOverlay = document.getElementById('welcome-overlay');
	const enterButton = document.getElementById('enter-button');
	const navbar = document.getElementById('navbar');
	const musicControl = document.getElementById('music-control');
	
	// List of wedding-themed music (you can replace these with your own)
	const weddingSongs = [
		'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
		'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
		'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
	];
	
	// Create audio element
	const audio = new Audio();
	let isPlaying = false;
	
	// Randomly select a song
	function playRandomWeddingSong() {
		const randomSong = weddingSongs[Math.floor(Math.random() * weddingSongs.length)];
		audio.src = randomSong;
		audio.loop = true;
		audio.volume = 0.5; // Set volume to 50%
		audio.play()
			.then(() => {
				isPlaying = true;
				musicControl.innerHTML = '<i class="fas fa-pause"></i>';
			})
			.catch(error => {
				console.log('Autoplay prevented:', error);
				// Show play button to allow user to start music manually
				musicControl.classList.add('show');
			});
	}
	
	// Enter button click handler
	enterButton.addEventListener('click', function() {
		// Hide welcome overlay
		welcomeOverlay.classList.add('hidden');
		
		// Show navbar
		setTimeout(() => {
			navbar.classList.add('show');
		}, 500);
		
		// Play music
		playRandomWeddingSong();
		
		// Show music control after a delay
		setTimeout(() => {
			musicControl.classList.add('show');
		}, 1000);
	});
	
	// Music control click handler
	musicControl.addEventListener('click', function() {
		if (isPlaying) {
			audio.pause();
			musicControl.innerHTML = '<i class="fas fa-play"></i>';
		} else {
			audio.play()
				.then(() => {
					musicControl.innerHTML = '<i class="fas fa-pause"></i>';
				})
				.catch(error => {
					console.log('Playback failed:', error);
				});
		}
		isPlaying = !isPlaying;
	});
	

});