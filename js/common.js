"use strict";

document.addEventListener("DOMContentLoaded", () => {
	const burger = document.querySelector('.burger');
	const modalMenu = document.querySelector('.header--wrapper__block');
	burger.addEventListener('click', (event) => {
		burger.classList.toggle('active');
		modalMenu.classList.toggle('active');
		if (modalMenu.classList.contains('active')) {
			// При открытии меню
			modalMenu.style.maxHeight = `${modalMenu.scrollHeight}px`;
			document.body.classList.add('hidden');
			document.documentElement.classList.add('hidden');
		} else {
				// При закрытии меню
				modalMenu.style.maxHeight = 0;
				document.body.classList.remove('hidden');
				document.documentElement.classList.remove('hidden');
		}
		document.addEventListener('click', (event) => {
			if (!event.target.closest('.header--wrapper__block.active') && !event.target.closest('.burger')) {
				modalMenu.classList.remove('active');
				burger.classList.remove('active');
				modalMenu.style.maxHeight = 0;
				document.body.classList.remove('hidden');
				document.documentElement.classList.remove('hidden');
			}
		});
	});
	
	// Инициализация flatpickr для поля "Выезд"
	flatpickr("#departure-date", {
		dateFormat: "Y-m-d",
		minDate: new Date().fp_incr(1), // Минимальная дата на один день после текущей
		defaultDate: new Date().fp_incr(1),
		locale: "ru",
		disable: [
			function(date) {
				return date < new Date(); // Отключаем все прошедшие даты
			}
		]
	});

	// Инициализация flatpickr для поля "Заезд"
	flatpickr("#arrival-date", {
		dateFormat: "Y-m-d",
		minDate: "today",
		defaultDate: "today",
		locale: "ru",
		disable: [
			function(date) {
				return date < new Date(); 
			}
		],
		onChange: function(selectedDates, dateStr, instance) {
			// Получаем выбранную дату для "Заезда"
			var arrivalDate = selectedDates[0];

			// Получаем текущую дату для "Выезда"
			var departureDate = document.querySelector("#departure-date")._flatpickr.selectedDates[0];

			// Если дата "Выезда" меньше выбранной даты "Заезда", меняем её на дату "Заезда" + 1 день
			if (departureDate && arrivalDate && departureDate < arrivalDate) {
				// Устанавливаем новую дату для "Выезда"
				var newDepartureDate = new Date(arrivalDate);
				newDepartureDate.setDate(newDepartureDate.getDate() + 1);

				// Обновляем значение в поле "Выезд"
				document.querySelector("#departure-date")._flatpickr.setDate(newDepartureDate, true);
			}
		}
	});

	// защита от спама
	let eventCalllback = function(e) {
		let el = e.target,
			clearVal = el.dataset.phoneClear,
			pattern = el.dataset.phonePattern,
			matrix_def = "+_(___) ___-__-__",
			matrix = pattern ? pattern : matrix_def,
			i = 0,
			def = matrix.replace(/\D/g, ""),
			val = e.target.value.replace(/\D/g, "");
		if (clearVal !== 'false' && e.type === 'blur') {
			if (val.length < matrix.match(/([\_\d])/g).length) {
				e.target.value = '';
				return;
			}
		}
		if (def.length >= val.length) val = def;
		e.target.value = matrix.replace(/./g, function(a) {
			return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
		});
	}
	let phone_inputs = document.querySelectorAll('.wpcf7-tel');
	for (let elem of phone_inputs) {
		for (let ev of ['input', 'blur', 'focus']) {
			elem.addEventListener(ev, eventCalllback);
		}
	}
	const fio = document.querySelectorAll('input[name="fio"]');
	fio.forEach(name =>{
		name.addEventListener('keyup', function() {
			this.value = this.value.replace(/http|https|url|.net|www|.ru|.com|[0-9]/g, '');
		});

	});
	document.querySelectorAll('input[type="text"], textarea, input[type="number"]').forEach(field => {
		field.addEventListener('input', function () {
			// Удаляем все латинские буквы
			this.value = this.value.replace(/[a-zA-Z]/g, '');
		});
	});
	document.querySelectorAll('input[type="text"], textarea, input[type="number"]').forEach(field => {
    // Запрещаем вставку в поля ввода
    field.addEventListener('paste', function(event) {
        event.preventDefault();  // Отменяем вставку
    });
	});
	document.querySelectorAll('.la-sentinelle-container input[type="text"]').forEach((field) => {
		field.addEventListener('change', () => {
			let buttons = document.querySelectorAll('.wpcf7-submit');
			buttons.forEach((button) => {
				button.remove();
			});
		});
	});
	// !защита от спама

	const swiper = new Swiper('.main--reviews__wrapper', {
		loop: true,
		slidesPerView: 4,
		slidesPerGroup: 4,
		spaceBetween: 30,
		loop: false,
		initialSlide: 0,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			renderBullet: function (index, className) {
				return `<span class="${className}">${index + 1}</span>`;
			},
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		breakpoints: {
			1400: {
				slidesPerView: 3, // Показать 3 слайда от 1400px и выше
				slidesPerGroup: 3, // Листать по 3 слайда
			},
			768: {
				slidesPerView: 2, // Показать 2 слайда от 768px
				slidesPerGroup: 2, // Листать по 2 слайда
			},
			480: {
				slidesPerView: 1, // Показать 1 слайд от 480px
				slidesPerGroup: 1, // Листать по 1 слайду
			},
			0: {
				slidesPerView: 1, // Показать 1 слайд от 480px
				slidesPerGroup: 1, // Листать по 1 слайду
			},
		},
	});

	function updatePagination(swiper) {
		const bullets = swiper.pagination.bullets;
		const maxVisible = 5; // Максимальное количество видимых номеров
		const total = bullets.length;
	
		// Сначала сбрасываем все bullets к их исходным индексам
		bullets.forEach((bullet, index) => {
			bullet.style.display = 'none';
			bullet.innerHTML = index + 1; // Возвращаем цифры
		});
	
		// Определяем диапазон видимых элементов
		const currentIndex = swiper.realIndex / swiper.params.slidesPerGroup;
		const start = Math.max(0, currentIndex - 2);
		const end = Math.min(total, currentIndex + 3);
	
		// Отображаем только нужные цифры
		bullets.forEach((bullet, index) => {
			if (index >= start && index < end) {
				bullet.style.display = 'inline-block';
			}
		});
	
		// Добавление многоточий
		if (start > 0) {
			bullets[start - 1].style.display = 'inline-block';
			bullets[start - 1].innerHTML = '...';
		}
		if (end < total) {
			bullets[end].style.display = 'inline-block';
			bullets[end].innerHTML = '...';
		}
	}
	
	// Обновляем пагинацию при изменении слайдов
	swiper.on('slideChange', function () {
		updatePagination(swiper);
	});
	
	// Инициализация при загрузке
	updatePagination(swiper);

	const banner = new Swiper('.main--banner__wrapper', {
		loop: true,
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 30,
		loop: false,
		initialSlide: 0,
		autoHeight: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});

	let whyUsSwiperInstance;
	let housesSwiperInstance;
	function toggleBlocks() {
		const screenWidth = window.innerWidth;

		// --- Управление блоками WhyUs ---
		const whyUsDesktop = document.querySelector('.main--whyUs__wrapper.desktop');
		const whyUsTablet = document.querySelector('.main--whyUs__wrapper.tablet.swiper');
		if (whyUsDesktop && whyUsTablet) {
			if (screenWidth > 992) {
				whyUsDesktop.classList.add('active');
				whyUsTablet.classList.remove('active');

				if (whyUsSwiperInstance) {
					whyUsSwiperInstance.destroy(true, true);
					whyUsSwiperInstance = null;
				}
			} else {
				whyUsDesktop.classList.remove('active');
				whyUsTablet.classList.add('active');

				if (!whyUsSwiperInstance) {
					whyUsSwiperInstance = new Swiper('.main--whyUs__wrapper.tablet.swiper', {
						pagination: { el: '.swiper-pagination', clickable: true },
						slidesPerView: 1,
						loop: true,
						spaceBetween: 20,
						autoHeight: true, // Автоматическая высота
						breakpoints: {
							0: {
								slidesPerView: "auto",
								loop: false
							},
						},
					});
				}
			}
		}

		// --- Управление блоками Houses ---
		const housesDesktop = document.querySelector('.main--houses__wrapper.desktop');
		const housesTablet = document.querySelector('.main--houses__wrapper.tablet.swiper');
		if (housesDesktop && housesTablet) {
			if (screenWidth > 992) {
				housesDesktop.classList.add('active');
				housesTablet.classList.remove('active');

				if (housesSwiperInstance) {
					housesSwiperInstance.destroy(true, true);
					housesSwiperInstance = null;
				}
			} else {
				housesDesktop.classList.remove('active');
				housesTablet.classList.add('active');

				if (!housesSwiperInstance) {
					housesSwiperInstance = new Swiper('.main--houses__wrapper.tablet.swiper', {
						pagination: { el: '.swiper-pagination', clickable: true },
						slidesPerView: 1,
						loop: true,
						spaceBetween: 20,
						autoHeight: true, // Автоматическая высота
						breakpoints: {
							0: {
								slidesPerView: "auto",
								loop: false
							},
						},
					});
				}
			}
		}
	}
	// Проверка при загрузке страницы и изменении размера окна
	toggleBlocks();
	window.addEventListener('resize', toggleBlocks);

	const smoothHeight = (itemSelector, buttonSelector, contentSelector) => {
		const items = document.querySelectorAll(itemSelector);

		if (!items.length) return;

		// Добавляем класс 'active', 'data-open="true"' и устанавливаем max-height первому элементу
		const firstItem = items[0];
		const firstButton = firstItem.querySelector(buttonSelector);
		const firstContent = firstItem.querySelector(contentSelector);
		firstItem.classList.add('active');
		firstButton.classList.add('active');
		firstItem.dataset.open = 'true';
		firstContent.style.maxHeight = `${firstContent.scrollHeight}px`;

		items.forEach(el => {
			const button = el.querySelector(buttonSelector);
			const content = el.querySelector(contentSelector);

			button.addEventListener('click', () => {
				if (el.dataset.open !== 'true') {
					// Удаляем параметры для всех элементов, кроме текущего
					items.forEach(item => {
						if (item !== el) {
							item.dataset.open = 'false';
							item.classList.remove('active');
							item.querySelector(buttonSelector).classList.remove('active');
							item.querySelector(contentSelector).style.maxHeight = '';
						}
					});
					el.dataset.open = 'true';
					button.classList.add('active');
					el.classList.add('active');
					content.style.maxHeight = `${content.scrollHeight}px`;
				} else {
					el.dataset.open = 'false';
					el.classList.remove('active');
					button.classList.remove('active');
					content.style.maxHeight = '';
				}
			})

			const onResize = () => {
				if (el.dataset.open === 'true') {
					if (parseInt(content.style.maxHeight) !== content.scrollHeight) {
						content.style.maxHeight = `${content.scrollHeight}px`;
					}
				}
			}

			window.addEventListener('resize', onResize);
		});
	}
	smoothHeight('.main--faq__item', '.main--faq__item--button', '.main--faq__item--answer');

	// Даты, которые заняты
	const bookedDates = ["2025-01-23", "2025-01-24"];

	// Инициализация flatpickr
	flatpickr("#house_calendar", {
		inline: true, // Календарь отображается сразу
		mode: "range", // Выбор одной даты
		minDate: "today", // Запрет на выбор прошедших дат
		dateFormat: "Y-m-d",
		disable: bookedDates.map(date => new Date(date)), // Даты, которые нельзя выбрать
		locale: "ru", // Локализация на русский язык
	});

	Fancybox.bind("[data-fancybox]", {
		Toolbar: {
			display: {
				left: [],
				middle: [],
				right: ["close"],
			},
		},
	});

	const gallery = new Swiper('.house--gallery__wrapper .swiper', {
		loop: true,
		slidesPerView: 3,
		slidesPerGroup: 3,
		spaceBetween: 40,
		loop: false,
		initialSlide: 0,
		autoHeight: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		breakpoints: {
			1400: {
				slidesPerView: 3, // Показать 3 слайда от 1400px и выше
				slidesPerGroup: 3, // Листать по 3 слайда
				spaceBetween: 40,
			},
			768: {
				slidesPerView: 3, // Показать 2 слайда от 768px
				slidesPerGroup: 3, // Листать по 2 слайда
				spaceBetween: 25,
			},
			480: {
				slidesPerView: 2, // Показать 1 слайд от 480px
				slidesPerGroup: 2, // Листать по 1 слайду
				spaceBetween: 25,
			},
			0: {
				slidesPerView: 1, // Показать 1 слайд от 480px
				slidesPerGroup: 1, // Листать по 1 слайду
				spaceBetween: 20,
			},
		},
	});

	const goTop = document.querySelector('.goTop');
	if (goTop ){
		window.addEventListener('scroll', function() {
			var scrollPosition = window.scrollY || document.documentElement.scrollTop;
			var goTopButton = document.querySelector('.goTop');
	
			if (scrollPosition >= 840) {
				goTopButton.classList.add('active');
			} else {
				goTopButton.classList.remove('active');
			}
		});
	
		goTop.addEventListener('click', function() {
			goTop.classList.remove('active');
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		});
	}

});