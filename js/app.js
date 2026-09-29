// STATE VARIABLES
let currentAboutStepIndex = 0;
let selectedCategory = 'all';
let stackIndex = 0;
let charIndex = 0;
let isDeleting = false;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    renderCourses();
    renderAboutStep();
    handleHeroTypingEffect();
    handleNavbarScroll();
});

// NAVBAR SCROLL EFFECT
function handleNavbarScroll() {
    const nav = document.getElementById('mainNavbar');
    if (!nav) return;

    if (window.scrollY > 20) {
        nav.classList.add('bg-[#0d3b28]/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-emerald-700/50');
    } else {
        nav.classList.remove('bg-[#0d3b28]/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-emerald-700/50');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// HERO TYPING EFFECT LOGIC
function handleHeroTypingEffect() {
    const textElement = document.getElementById('heroTypingText');
    if (!textElement) return;

    const currentText = techStacks[stackIndex];

    if (isDeleting) {
        textElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stackIndex = (stackIndex + 1) % techStacks.length;
        typingSpeed = 400;
    }

    setTimeout(handleHeroTypingEffect, typingSpeed);
}

// RENDER COURSES & FILTER LOGIC
function renderCourses() {
    const grid = document.getElementById('courseGrid');
    const emptyState = document.getElementById('emptyState');
    if (!grid) return;

    const filtered = coursesData.filter(course => {
        return selectedCategory === 'all' || course.category === selectedCategory;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    } else {
        if (emptyState) emptyState.classList.add('hidden');
    }

    filtered.forEach(course => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl border-2 border-slate-200/80 hover:border-[#0d3b28] hover:ring-4 hover:ring-[#0d3b28]/20 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden flex flex-col group cursor-pointer";
        card.onclick = () => openModal(course.id);
        card.innerHTML = `
            <div class="relative h-44 sm:h-48 lg:h-52 overflow-hidden bg-slate-100">
                <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute bottom-3 right-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0d3b28] text-white border-2 border-emerald-300/40 font-bold text-xs flex items-center justify-center shadow-lg">
                    ${course.price}
                </div>
            </div>
            <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                    <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 sm:mb-2">
                        ${course.categoryLabel}
                    </span>
                    <h3 class="text-sm sm:text-base lg:text-lg font-bold text-slate-900 group-hover:text-[#0d3b28] transition-colors line-clamp-2 leading-snug mb-2 sm:mb-3">
                        ${course.title}
                    </h3>
                    <div class="flex items-center gap-2 mb-3 sm:mb-4">
                        <div class="flex text-amber-400 text-xs gap-0.5">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star-half-stroke"></i>
                        </div>
                        <span class="text-xs font-bold text-slate-800">${course.rating}</span>
                        <span class="text-xs text-slate-400 font-normal">(${course.reviewsCount})</span>
                    </div>
                </div>
                <div class="pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
                    <span class="flex items-center gap-1.5">
                        <i class="fa-solid fa-user-group text-slate-400"></i> ${course.students} Enrolled
                    </span>
                    <span class="flex items-center gap-1.5">
                        <i class="fa-solid fa-video text-slate-400"></i> ${course.videos}
                    </span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(category) {
    selectedCategory = category;

    const buttons = document.querySelectorAll('#categoryContainer button');
    buttons.forEach(btn => {
        btn.className = "category-btn px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all bg-white text-slate-700 border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50";
    });

    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.className = "category-btn active px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all bg-[#0d3b28] text-white shadow-md";
    }

    renderCourses();
}

// RENDER ABOUT STEPPER & SWEEP EFFECT
function renderAboutStep() {
    const currentData = aboutStepsData[currentAboutStepIndex];

    const imgEl = document.getElementById('aboutStepImage');
    const captionEl = document.getElementById('aboutStepCaption');

    if (imgEl) {
        imgEl.src = currentData.image;
        imgEl.alt = currentData.title;
    }
    if (captionEl) {
        captionEl.textContent = currentData.caption;
    }

    const dotsContainer = document.getElementById('aboutStepDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        aboutStepsData.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.onclick = () => goToAboutStep(idx);
            dot.className = idx === currentAboutStepIndex
                ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-amber-400 rounded-full transition-all duration-300'
                : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white rounded-full transition-all duration-300';
            dotsContainer.appendChild(dot);
        });
    }

    const stepsContainer = document.getElementById('aboutStepsContainer');
    if (stepsContainer) {
        stepsContainer.innerHTML = '';

        const line = document.createElement('div');
        line.className = 'absolute left-4 sm:left-5 top-4 sm:top-5 bottom-4 sm:bottom-5 w-0.5 bg-slate-200 -z-10';
        stepsContainer.appendChild(line);

        aboutStepsData.forEach((item, idx) => {
            const isActive = idx === currentAboutStepIndex;
            const stepItem = document.createElement('div');
            stepItem.className = 'flex items-start gap-4 sm:gap-5 cursor-pointer group';
            stepItem.onclick = () => goToAboutStep(idx);

            if (isActive) {
                stepItem.innerHTML = `
                    <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0d3b28] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md ring-4 ring-emerald-100">
                        ${item.step}
                    </div>
                    <div class="flex-1 -mt-1 sm:-mt-2">
                        <span class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-200 block tracking-tighter leading-none select-none mb-1">
                            ${item.step}
                        </span>
                        <h3 class="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 leading-snug">
                            ${item.title}
                        </h3>
                        <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2 sm:mt-3 font-normal max-w-lg">
                            ${item.description}
                        </p>
                    </div>
                `;
            } else {
                stepItem.innerHTML = `
                    <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-[#0d3b28] font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 transition-colors">
                        ${item.step}
                    </div>
                    <div class="flex-1 pt-1">
                        <h3 class="text-xs sm:text-base font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
                            ${item.title}
                        </h3>
                    </div>
                `;
            }

            stepsContainer.appendChild(stepItem);
        });
    }
}

function prevAboutStep() {
    const nextIdx = (currentAboutStepIndex - 1 + aboutStepsData.length) % aboutStepsData.length;
    goToAboutStep(nextIdx, 'left');
}

function nextAboutStep() {
    const nextIdx = (currentAboutStepIndex + 1) % aboutStepsData.length;
    goToAboutStep(nextIdx, 'right');
}

function goToAboutStep(index, direction = null) {
    if (index === currentAboutStepIndex && direction === null) return;

    const sweepLine = document.getElementById('aboutStepSweepLine');
    const targetDir = direction || (index > currentAboutStepIndex ? 'right' : 'left');

    if (sweepLine) {
        sweepLine.classList.remove('animate-sweep-ltr', 'animate-sweep-rtl');
        void sweepLine.offsetWidth;

        if (targetDir === 'right') {
            sweepLine.classList.add('animate-sweep-ltr');
        } else {
            sweepLine.classList.add('animate-sweep-rtl');
        }
    }

    setTimeout(() => {
        currentAboutStepIndex = index;
        renderAboutStep();
    }, 200);
}

// MODAL HANDLERS
function openModal(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="flex items-center gap-2 text-[#0d3b28] font-bold text-xs uppercase tracking-wider mb-2">
            <i class="fa-solid fa-graduation-cap text-amber-500"></i> Modul Pembelajaran
        </div>
        <h3 class="text-lg sm:text-xl font-extrabold text-slate-900 mb-2 leading-snug">${course.title}</h3>
        <p class="text-xs text-slate-500 mb-3">Mentor: <strong class="text-slate-700">${course.mentor}</strong></p>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">${course.description}</p>

        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">Materi Yang Dipelajari:</h4>
        <ul class="space-y-2 mb-6">
            ${course.syllabus.map(item => `
                <li class="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i>
                    <span>${item}</span>
                </li>
            `).join('')}
        </ul>

        <div class="flex items-center gap-3">
            <button onclick="closeModal()" class="w-full py-3 bg-[#0d3b28] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md">
                Akses Modul Sekarang
            </button>
        </div>
    `;

    document.getElementById('courseModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('courseModal').classList.add('hidden');
}

// NAVIGATION & DROPDOWN TOGGLES
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
}

function toggleContactMenu() {
    const card = document.getElementById('contactCard');
    const chevron = document.getElementById('contactChevron');

    if (!card || !chevron) return;

    const isOpen = card.classList.contains('opacity-100');

    if (!isOpen) {
        card.classList.remove('opacity-0', 'scale-90', '-translate-y-4', 'pointer-events-none');
        card.classList.add('opacity-100', 'scale-100', 'translate-y-0', 'pointer-events-auto');
        chevron.classList.add('rotate-180');
    } else {
        card.classList.remove('opacity-100', 'scale-100', 'translate-y-0', 'pointer-events-auto');
        card.classList.add('opacity-0', 'scale-90', '-translate-y-4', 'pointer-events-none');
        chevron.classList.remove('rotate-180');
    }
}

// CLOSE DROPDOWN ON CLICK OUTSIDE
document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('contactDropdownWrapper');
    const card = document.getElementById('contactCard');
    const chevron = document.getElementById('contactChevron');

    if (wrapper && !wrapper.contains(e.target) && card && card.classList.contains('opacity-100')) {
        card.classList.remove('opacity-100', 'scale-100', 'translate-y-0', 'pointer-events-auto');
        card.classList.add('opacity-0', 'scale-90', '-translate-y-4', 'pointer-events-none');
        chevron.classList.remove('rotate-180');
    }
});