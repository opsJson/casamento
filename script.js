const gifts = [
	{
		id: 1,
		name: "Batedeira",
		image: "presentes/batedeira.png"
	},
	{
		id: 2,
		name: "Jogo de copo",
		image: "presentes/jogo de copo.png"
	},
	{
		id: 3,
		name: "Jogo de jantar",
		image: "presentes/jogo de jantar.png"
	},
	{
		id: 4,
		name: "Liquidificador",
		image: "presentes/liquidificador.png"
	},
	{
		id: 5,
		name: "Microondas",
		image: "presentes/microondas.png"
	},
	{
		id: 6,
		name: "Multiprocessador",
		image: "presentes/multiprocessador.png"
	},
	{
		id: 7,
		name: "Cafeteira Nespresso",
		image: "presentes/nespresso.png"
	},
	{
		id: 8,
		name: "Maquina de Lavar",
		image: "presentes/maquina de lavar.png"
	},
	{
		id: 9,
		name: "Geladeira",
		image: "presentes/geladeira.png"
	},
	{
		id: 10,
		name: "Jarra de Suco",
		image: "presentes/jarra.png"
	},
	{
		id: 11,
		name: "Churrasqueira Elétrica",
		image: "presentes/grill.png"
	},
	{
		id: 12,
		name: "Aspirador de pó",
		image: "presentes/aspirador de po.png"
	},
	{
		id: 13,
		name: "Ferro de passar",
		image: "presentes/ferro de passar.png"
	},
	{
		id: 14,
		name: "Edredom/Cobertor",
		image: "presentes/edredom.png"
	},
	{
		id: 15,
		name: "Ventilador",
		image: "presentes/ventilador.png"
	},
	{
		id: 16,
		name: "Purificador de Água",
		image: "presentes/purificador.png"
	},
	{
		id: 17,
		name: "Sanduicheira",
		image: "presentes/sanduicheira.png"
	},
	{
		id: 18,
		name: "Panela de Arroz",
		image: "presentes/arroz.png"
	},
	{
		id: 19,
		name: "Panela de Pressão",
		image: "presentes/panela de pressao.png"
	},
	{
		id: 20,
		name: "Frigideira",
		image: "presentes/frigideira.png"
	},
	{
		id: 21,
		name: "Potes Hermêticos",
		image: "presentes/hermeticos.png"
	},
	{
		id: 22,
		name: "Air Fryer",
		image: "presentes/airfryer.png"
	}
];

const giftReservations = JSON.parse(localStorage.getItem("giftReservations")) || {};
const rsvpList = JSON.parse(localStorage.getItem("rsvpList")) || [];

let currentGiftIndex = 0;
let currentGuestIndex = 0;
let itemsPerSlide = 1;

const musicControl = document.getElementById("music-control");
const audio = new Audio();
let isPlaying = false;

document.getElementById("enter-button").addEventListener("click", function() {
	document.getElementById("welcome-overlay").classList.add("hidden");
	document.getElementById("navbar").classList.add("show");
	playSong();
	
	setTimeout(() => {
		musicControl.classList.add("show");
	}, 1000);
	
	renderGiftCarousel();
    renderGuestCarousel();
});

musicControl.addEventListener("click", function() {
	if (isPlaying) {
		audio.pause();
		musicControl.innerHTML = "<i class='fas fa-play'></i>";
	}
	else {
		audio.play()
		.then(() => {
			musicControl.innerHTML = "<i class='fas fa-pause'></i>";
		})
		.catch(error => {
			console.log(error);
		});
	}
	isPlaying = !isPlaying;
});

updateCountdown();
setInterval(updateCountdown, 1000);

document.getElementById("gift-form").addEventListener("submit", function(e) {
	e.preventDefault();
	
	const giftId = parseInt(document.getElementById("selected-gift").value);
	const giverName = document.getElementById("giver-name").value;
	
	giftReservations[giftId] = { giverName, date: new Date().toISOString() };
	localStorage.setItem("giftReservations", JSON.stringify(giftReservations));
	
	closeModal();
	renderGiftCarousel();
});

document.getElementById("rsvp-form").addEventListener("submit", function(e) {
	e.preventDefault();
	
	const name = document.getElementById("name").value;
	rsvpList.push({ name, date: new Date().toISOString() });
	localStorage.setItem("rsvpList", JSON.stringify(rsvpList));
	renderGuestCarousel();

	this.reset();
	document.getElementById("guests").scrollIntoView({ behavior: "smooth" });
});


function renderGiftCarousel() {
    const giftCarousel = document.getElementById('gift-carousel');
    const giftDots = document.getElementById('gift-dots');
    
    giftCarousel.innerHTML = '';
    giftDots.innerHTML = '';
    
    const totalSlides = Math.ceil(gifts.length / itemsPerSlide);
    
    gifts.forEach((gift, index) => {
        const isReserved = giftReservations[gift.id];
        
        const giftItem = document.createElement('div');
        giftItem.className = 'carousel-item';
        giftItem.innerHTML = `
            <div class="gift-item bg-white rounded-lg overflow-hidden shadow-md transition duration-300 h-full mx-2">
                <img src="${gift.image}" alt="${gift.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="title-font text-xl mb-2">${gift.name}</h3>
                    ${isReserved ? 
                        `<p class="text-green-600 mb-2">Reservado por ${isReserved.giverName}</p>
                         <button onclick="openModal(${gift.id})" class="mt-2 inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed" disabled>Presenteado</button>` :
                        `<button onclick="openModal(${gift.id})" class="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition duration-300">Presentear</button>`
                    }
                </div>
            </div>
        `;
        giftCarousel.appendChild(giftItem);
    });
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => {
            currentGiftIndex = i;
            updateGiftCarousel();
        };
        giftDots.appendChild(dot);
    }
    
    updateGiftCarousel();
}

function moveGiftCarousel(direction) {
    const totalSlides = Math.ceil(gifts.length / itemsPerSlide);
    currentGiftIndex = (currentGiftIndex + direction + totalSlides) % totalSlides;
    updateGiftCarousel();
}

function updateGiftCarousel() {
    const giftCarousel = document.getElementById('gift-carousel');
    const giftDots = document.querySelectorAll('#gift-dots .carousel-dot');
    const itemWidth = document.querySelector('.carousel-item').offsetWidth;
    
	giftCarousel.style.transform = `translateX(-${currentGiftIndex * 100}%)`;
    
    // Update dots
    giftDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentGiftIndex);
    });
}

function renderGuestCarousel() {
    const guestCarousel = document.getElementById('guest-carousel');
    const guestDots = document.getElementById('guest-dots');
    
    guestCarousel.innerHTML = '';
    guestDots.innerHTML = '';
    
    // Filter only guests who confirmed attendance
    const confirmedGuests = rsvpList;
    const totalSlides = Math.ceil(confirmedGuests.length / itemsPerSlide);
    
    if (confirmedGuests.length === 0) {
        guestCarousel.innerHTML = `
            <div class="no-guests carousel-item w-full">
                <i class="fas fa-heart-broken text-4xl text-gray-400 mb-4"></i>
                <p>Ainda não temos confirmações. Seja o primeiro a confirmar!</p>
            </div>
        `;
        return;
    }
    
    confirmedGuests.forEach((guest, index) => {
        const guestCard = document.createElement('div');
        guestCard.className = 'carousel-item';
        
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
            <div class="guest-card h-full mx-2">
                <div class="guest-icon">
                    <i class="fas ${randomIcon}"></i>
                </div>
                <h3 class="guest-name">${guest.name}</h3>
                <p class="guest-date">Confirmado em ${formattedDate}</p>
            </div>
        `;
        
        guestCarousel.appendChild(guestCard);
    });
    
    // Create dots if there are guests
    if (confirmedGuests.length > 0) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => {
                currentGuestIndex = i;
                updateGuestCarousel();
            };
            guestDots.appendChild(dot);
        }
    }
    
    updateGuestCarousel();
}

function moveGuestCarousel(direction) {
    const confirmedGuests = rsvpList;
    const totalSlides = Math.ceil(confirmedGuests.length / itemsPerSlide);
    currentGuestIndex = (currentGuestIndex + direction + totalSlides) % totalSlides;
    updateGuestCarousel();
}

function updateGuestCarousel() {
    const guestCarousel = document.getElementById('guest-carousel');
    const guestDots = document.querySelectorAll('#guest-dots .carousel-dot');
    const itemWidth = document.querySelector('.carousel-item').offsetWidth;
    
    guestCarousel.style.transform = `translateX(-${currentGuestIndex * 100}%)`;
    
    // Update dots
    guestDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentGuestIndex);
    });
}

function openModal(giftId) {
	document.getElementById("selected-gift").value = giftId;
	document.getElementById("gift-modal").style.display = "flex";
}

function closeModal() {
	document.getElementById("gift-modal").style.display = "none";
	document.getElementById("gift-form").reset();
}

function updateCountdown() {
	const weddingDate = new Date("June 27, 2025 16:30:00").getTime();
	
	const now = new Date().getTime();
	const distance = weddingDate - now;
	
	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	document.getElementById("days").textContent = days.toString().padStart(2, "0");
	document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
	document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
	document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
}

function smoothScroll(targetId) {
	document.getElementById(targetId)?.scrollIntoView({
		behavior: "smooth"
	});
}

function playSong() {
	audio.src = "background.mp3";
	audio.loop = true;
	audio.volume = 1;
	audio.play()
	.then(() => {
		isPlaying = true;
		musicControl.innerHTML = "<i class='fas fa-pause'></i>";
	})
	.catch(error => {
		console.log(error);
		musicControl.classList.add("show");
	});
}