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
	},
	{
		id: 23,
		name: "Cesto de Roupas",
		image: "presentes/cesto de roupa.png"
	},
	{
		id: 24,
		name: "Fruteira",
		image: "presentes/fruteira.png"
	},
	{
		id: 25,
		name: "Escorredor de louças",
		image: "presentes/escorredor.png"
	},
	{
		id: 26,
		name: "Organizadores de Geladeira",
		image: "presentes/organizadores geladeira.png"
	},
	{
		id: 27,
		name: "Galheteiro",
		image: "presentes/galheteiro.png"
	},
	{
		id: 28,
		name: "Organizadores de Produtos de Limpeza",
		image: "presentes/organizadores limpeza.png"
	},
	{
		id: 29,
		name: "Tábua de Corte de Vidro",
		image: "presentes/tabua corte.png"
	},
	{
		id: 30,
		name: "Jogo de travessas",
		image: "presentes/travessas.png"
	},
	{
		id: 31,
		name: "Formas Fundo Removível",
		image: "presentes/formas.png"
	},
	{
		id: 32,
		name: "Pano de Prato Neutro",
		image: "presentes/pano de prato.png"
	},
	{
		id: 33,
		name: "Boleira",
		image: "presentes/boleira.png"
	},
	{
		id: 34,
		name: "Fogão",
		image: "presentes/fogao.png"
	},
	{
		id: 35,
		name: "Cama Box",
		image: "presentes/cama.png"
	},
	{
		id: 36,
		name: "Depurador de Ar",
		image: "presentes/depurador.png"
	},
	{
		id: 37,
		name: "Jogo de Taças",
		image: "presentes/jogo de tacas.png"
	},
	{
		id: 38,
		name: "Kit Churrasco",
		image: "presentes/kit churrasco.png"
	},
	{
		id: 39,
		name: "Jogo de Panelas",
		image: "presentes/jogo de panela.png"
	},
	{
		id: 40,
		name: "Utensílios de Cozinha",
		image: "presentes/utensilos de cozinha.png"
	}
];

const giftReservations = JSON.parse(localStorage.getItem("giftReservations")) || {};
const rsvpList = JSON.parse(localStorage.getItem("rsvpList")) || [];

const musicControl = document.getElementById("music-control");
const audio = new Audio();
let isPlaying = false;
let swiperInstance;

let uuid = localStorage.getItem("uuid");
if (!uuid) {
	uuid = crypto.randomUUID();
	localStorage.setItem("uuid", uuid);
}

document.getElementById("enter-button").addEventListener("click", function() {
	document.getElementById("welcome-overlay").classList.add("hidden");
	document.getElementById("navbar").classList.add("show");
	playSong();
	
	setTimeout(() => {
		musicControl.classList.add("show");
	}, 1000);
	
	renderGiftCarousel();
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

document.getElementById("gift-form").addEventListener("submit", async function(e) {
	e.preventDefault();
	const giftId = parseInt(document.getElementById("selected-gift").value);
	let giverName = document.getElementById("giver-name").value?.trim();
	if (!giverName) return;

	giverName = giverName.toLowerCase().split(" ").map(e => e[0].toUpperCase() + e.slice(1)).join(" ");

	await fetch("https://g2gpnwmrawd4jxxfiopm6wkb4a0hlros.lambda-url.sa-east-1.on.aws/add", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: giftId, giverName, uuid })
	});

	closeModal();
	renderGiftCarousel();
	soltarFogos();
});


window.addEventListener("resize", () => {
  swiperInstance?.update();
});

function openModal(giftId) {
	document.getElementById("selected-gift").value = giftId;
	document.getElementById("gift-modal").style.display = "flex";
	document.getElementById("giver-name").focus();
}

function closeModal() {
	document.getElementById("gift-modal").style.display = "none";
	document.getElementById("gift-form").reset();
}

function updateCountdown() {
	const weddingDate = new Date("June 27, 2025 20:00:00").getTime();
	
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

async function fetchGiftReservations() {
	const res = await fetch("https://g2gpnwmrawd4jxxfiopm6wkb4a0hlros.lambda-url.sa-east-1.on.aws/");
	const data = await res.json();
	return Array.isArray(data) ? data : [];
}

async function renderGiftCarousel() {
	const track = document.getElementById("gift-carousel-track");
	track.innerHTML = "";

	const reservations = await fetchGiftReservations();
	const giftMap = {};
	reservations.forEach(r => giftMap[r.id] = r);

	// Separar presentes
	const reservados = [], naoReservados = [];
	gifts.forEach(gift => {
		if (giftMap[gift.id]) reservados.push(gift);
		else naoReservados.push(gift);
	});

	// Embaralhar
	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	const embaralhados = [...shuffle(naoReservados), ...shuffle(reservados)];

	embaralhados.forEach(gift => {
		const r = giftMap[gift.id];
		const slide = document.createElement("div");
		slide.className = "swiper-slide";
		slide.innerHTML = `
			<div class="gift-item">
				<img src="${gift.image}" alt="${gift.name}" class="w-full h-48 object-cover">
				<div class="p-4 text-center">
					<h3 class="title-font text-xl mb-2">${gift.name}</h3>
					${r ? `
						<p class='text-green-600 mb-2'>Reservado por ${r.giverName}</p>
						${r.uuid === uuid
							? `<button onclick="cancelarPresente(${gift.id})" class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Cancelar</button>`
							: `<button class='bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed' disabled>Presenteado</button>`
						}
					` : `
						<button onclick="openModal(${gift.id})" class="mt-2 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition">Presentear</button>
					`}
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
			640: { slidesPerView: 2 },
			1024: { slidesPerView: 3 }
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


function soltarFogos() {
	confetti({
		particleCount: 150,
		spread: 70,
		origin: { y: 0.6 }
	});
}

async function cancelarPresente(giftId) {
	if (!confirm("Tem certeza que deseja cancelar sua reserva deste presente?")) return;
	await fetch("https://g2gpnwmrawd4jxxfiopm6wkb4a0hlros.lambda-url.sa-east-1.on.aws/remove", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: giftId, uuid })
	});
	renderGiftCarousel();
}
