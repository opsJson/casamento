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

const musicControl = document.getElementById("music-control");
const audio = new Audio();
let isPlaying = false;
let swiperInstance;
let guestSwiperInstance;

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

function renderGiftCarousel() {
  const track = document.getElementById("gift-carousel-track");
  track.innerHTML = "";

  gifts.forEach(gift => {
    const isReserved = giftReservations[gift.id];
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="gift-item">
        <img src="${gift.image}" alt="${gift.name}" class="w-full h-48 object-cover">
        <div class="p-4 text-center">
          <h3 class="title-font text-xl mb-2">${gift.name}</h3>
          ${isReserved ?
            `<p class='text-green-600 mb-2'>Reservado por ${isReserved.giverName}</p>
             <button class='bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed' disabled>Presenteado</button>` :
            `<button onclick="openModal(${gift.id})" class="mt-2 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition">Presentear</button>`
          }
        </div>
      </div>
    `;
    track.appendChild(slide);
  });

  if (swiperInstance) swiperInstance.destroy(true, true);

  swiperInstance = new Swiper(".gift-swiper", {
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: {
      640: {
        slidesPerView: 2
      },
      1024: {
        slidesPerView: 3
      }
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    }
  });
}

function renderGuestCarousel() {
  const track = document.getElementById("guest-carousel-track");
  track.innerHTML = "";

  if (!rsvpList || rsvpList.length === 0) {
    const slide = document.createElement("div");
    slide.className = "swiper-slide text-center p-6";
    slide.innerHTML = `
      <div class="text-gray-400">
        <i class="fas fa-heart-broken text-4xl"></i>
        <p class="mt-4">Ainda não temos confirmações. Seja o primeiro a confirmar!</p>
      </div>
    `;
    track.appendChild(slide);
  } else {
    rsvpList.forEach(guest => {
      const date = new Date(guest.date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const icons = ["fa-heart", "fa-glass-cheers", "fa-smile", "fa-star", "fa-gem"];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];

      const slide = document.createElement("div");
      slide.className = "swiper-slide text-center p-4";
      slide.innerHTML = `
        <div class="guest-card p-4">
          <div class="text-3xl text-amber-500 mb-2">
            <i class="fas ${randomIcon}"></i>
          </div>
          <h3 class="font-semibold text-lg">${guest.name}</h3>
          <p class="text-sm text-gray-500">Confirmado em ${date}</p>
        </div>
      `;
      track.appendChild(slide);
    });
  }

  if (guestSwiperInstance) guestSwiperInstance.destroy(true, true);

  guestSwiperInstance = new Swiper(".guest-swiper", {
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    },
    navigation: {
      nextEl: ".guest-swiper .swiper-button-next",
      prevEl: ".guest-swiper .swiper-button-prev"
    },
    pagination: {
      el: ".guest-swiper .swiper-pagination",
      clickable: true
    }
  });
}

window.addEventListener("resize", () => {
  swiperInstance?.update();
  guestSwiperInstance?.update();
});