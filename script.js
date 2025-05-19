document.addEventListener('DOMContentLoaded', initialize);

async function initialize() {
    try {
        await loadContent();
        setupRsvpForm();
        setupMusicControl();
        setupScrollUpDown();
        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        setupAnimations();
    } catch (error) {
        console.error('Initialization failed:', error);
        showMessage('Khởi tạo thất bại. Vui lòng thử lại sau.', 'text-red-600');
        document.querySelectorAll('.animate-element').forEach(el => {
            el.style.opacity = 1;
            el.style.transform = 'none';
        });
    }
}

async function loadContent() {
    const response = await fetch('./content.json');
    if (!response.ok) {
        throw new Error(`Không thể tải content.json: ${response.statusText}`);
    }
    const content = await response.json();
    renderContent(content);
}

function renderContent(content) {
    const elements = {
        'page-title': content.title,
        'header-title': content.header.title,
        'header-couple': content.header.couple,
        'header-day': content.header.day,
        'header-date': content.header.date,
        'groom-title': content.family.groom.title,
        'groom-father': content.family.groom.father,
        'groom-mother': content.family.groom.mother,
        'groom-location': content.family.groom.location,
        'bride-title': content.family.bride.title,
        'bride-father': content.family.bride.father,
        'bride-mother': content.family.bride.mother,
        'bride-location': content.family.bride.location,
        'announcement-text': content.announcement.text,
        'announcement-groom': content.announcement.groom,
        'announcement-bride': content.announcement.bride,
        'invite-text': content.invitation.inviteText,
        'event-text': content.invitation.eventText,
        'time-label': content.invitation.timeLabel,
        'time': content.invitation.time,
        'date': content.invitation.date,
        'lunar-date': `(${content.invitation.lunarDate})`,
        'location-text': content.invitation.locationText,
        'venue': content.invitation.venue,
        'address': content.invitation.address,
        'month-year': content.dateSection.monthYear,
        'rsvp-title': content.rsvp.title,
        'name-label': content.rsvp.nameLabel,
        'name': { placeholder: content.rsvp.namePlaceholder },
        'relationship-label': content.rsvp.relationshipLabel,
        'relationship': { placeholder: content.rsvp.relationshipPlaceholder },
        'message-label': content.rsvp.messageLabel,
        'message': { placeholder: content.rsvp.messagePlaceholder },
        'attendance-label': content.rsvp.attendanceLabel,
        'submit-rsvp': content.rsvp.submitButton,
        'gift-text': content.rsvp.giftText,
        'album-title': content.album.title,
        'thank-you': content.footer.thankYou,
        'welcome': content.footer.welcome
    };

    // Update text content and placeholders
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (typeof value === 'string') {
                element.textContent = value;
            } else if (value.placeholder) {
                element.placeholder = value.placeholder;
            }
        }
    });

    // Images
    const images = {
        'main-image': content.mainImage,
        'secondary-image': content.secondaryImage,
        'blurred-image': content.album.blurredImage
    };

    Object.entries(images).forEach(([id, { src, alt }]) => {
        const img = document.getElementById(id);
        if (img) {
            img.src = src;
            img.alt = alt;
        }
    });

    // Small images
    const smallImagesContainer = document.getElementById('small-images');
    if (smallImagesContainer) {
        content.invitation.smallImages.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            img.className = 'w-1/3 h-25 object-contain animate-element';
            if (index === 0) {
                img.dataset.animate = 'slide-left';
            } else if (index === 2) {
                img.dataset.animate = 'slide-right';
            } else {
                img.dataset.animate = 'fade-up'; 
            }
            if (index !== 1) {
                img.classList.add('mt-20');
            }
            smallImagesContainer.appendChild(img);
        });
    }

    // Map button
    const mapButton = document.querySelector('.wedding-button[href]');
    if (mapButton) {
        const mapQuery = encodeURIComponent(content.invitation.address);
        mapButton.href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}&origin=${encodeURIComponent(window.location.href)}`;
    }

    // Calendar
    const [dayStr, monthStr, yearStr] = content.dateSection.calendar.split('-');
    const weddingDay = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const calendarContainer = document.getElementById('calendar');
    if (calendarContainer) {
        calendarContainer.innerHTML = generateCalendar(year, month, weddingDay);
    }

    // Album images
    const albumImagesContainer = document.getElementById('album-images');
    if (albumImagesContainer) {
        content.album.images.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            img.className = 'h-40 object-contain animate-element';
            img.dataset.animate = index % 2 === 0 ? 'slide-left' : 'slide-right';
            img.style.justifySelf = index % 2 === 0 ? 'end' : 'start';
            albumImagesContainer.appendChild(img);
        });
    }

    // Music
    const audio = document.getElementById('wedding-music');
    if (audio) {
        audio.src = content.music.src;
    }
}

function generateCalendar(year, month, weddingDay) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = ((new Date(year, month - 1, 1).getDay() + 6) % 7); // Adjust Sunday to end
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    let calendarHTML = `
        <table class="calendar-table">
            <thead>
                <tr>${days.map(day => `<th>${day}</th>`).join('')}</tr>
            </thead>
            <tbody>
    `;

    let day = 1;
    for (let i = 0; i < 6 && day <= daysInMonth; i++) {
        calendarHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            if ((day === 1 && j < firstDay) || day > daysInMonth) {
                calendarHTML += '<td class="empty"></td>';
            } else {
                calendarHTML += `<td class="${day === weddingDay ? 'wedding-day' : ''}"><span>${day}</span></td>`;
                day++;
            }
        }
        calendarHTML += '</tr>';
    }

    return calendarHTML + '</tbody></table>';
}

function setupRsvpForm() {
    const submitButton = document.getElementById('submit-rsvp');
    submitButton?.addEventListener('click', handleRsvpSubmit);
}

function handleRsvpSubmit() {
    const inputs = {
        name: document.getElementById('name').value.trim(),
        relationship: document.getElementById('relationship').value.trim(),
        message: document.getElementById('message').value.trim(),
        attendance: document.getElementById('attendance').value
    };

    if (!inputs.name || !inputs.relationship || !inputs.message) {
        showMessage('Vui lòng điền đầy đủ thông tin.', 'text-red-600');
        return;
    }

    console.log('RSVP Data:', inputs);
    showMessage('Cảm ơn bạn đã xác nhận tham dự!', 'text-green-600');
    clearForm();
}

function showMessage(text, className) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.textContent = text;
        formMessage.className = `mt-2 text-sm ${className}`;
        formMessage.classList.remove('hidden');
    }
}

function clearForm() {
    ['name', 'relationship', 'message'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
    const attendance = document.getElementById('attendance');
    if (attendance) attendance.value = 'yes';
}

function setupMusicControl() {
    const audio = document.getElementById('wedding-music');
    const musicControl = document.getElementById('music-control');
    if (!audio || !musicControl) return;

    const enableAudio = () => {
        if (audio.paused) {
            audio.play().then(() => {
                musicControl.classList.add('playing');
            }).catch(error => {
                console.error('Lỗi khi phát nhạc:', error);
                showMessage('Không thể phát nhạc. Vui lòng nhấp lại vào biểu tượng nốt nhạc.', 'text-red-600');
            });
        }
        document.removeEventListener('pointerdown', enableAudio);
    };

    document.addEventListener('pointerdown', enableAudio);

    musicControl.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                musicControl.classList.remove('paused');
                musicControl.classList.add('playing');
            }).catch(error => {
                console.error('Lỗi khi phát nhạc:', error);
                showMessage('Không thể phát nhạc. Vui lòng nhấp lại vào biểu tượng nốt nhạc.', 'text-red-600');
            });
        } else {
            audio.pause();
            musicControl.classList.remove('playing');
            musicControl.classList.add('paused');
        }
    });
}

function setupScrollUpDown() {
    const scrollBtn = document.getElementById('scroll-toggle');
    if (!scrollBtn) return;

    let atTop = true;

    const updateIcon = () => {
        const scrollY = window.scrollY;
        const isBottom = scrollY + window.innerHeight >= document.body.scrollHeight - 100;
        const isTop = scrollY <= 100;

        if (isBottom && atTop) {
            atTop = false;
            scrollBtn.classList.replace('ph-arrow-circle-down', 'ph-arrow-circle-up');
        } else if (isTop && !atTop) {
            atTop = true;
            scrollBtn.classList.replace('ph-arrow-circle-up', 'ph-arrow-circle-down');
        }
    };

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: atTop ? document.body.scrollHeight : 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', updateIcon);
    updateIcon();
}

function setupAnimations() {
    const elements = document.querySelectorAll('.animate-element');
    elements.forEach((el, index) => {
        const animationType = el.dataset.animate;
        let animationProps = {};

        // Define animation attribute based on data-animate
        switch (animationType) {
            case 'fade-in':
                animationProps = { opacity: 0, y: 0 };
                break;
            case 'fade-up':
                animationProps = { opacity: 0, y: 50 };
                break;
            case 'slide-left':
                animationProps = { opacity: 0, x: -100 };
                break;
            case 'slide-right':
                animationProps = { opacity: 0, x: 100 };
                break;
            case 'zoom-in':
                animationProps = { opacity: 0, scale: 0.8 };
                break;
            default:
                animationProps = { opacity: 0 };
        }

        // Establish GSAP animation
        gsap.fromTo(
            el,
            animationProps,
            {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'cubic-bezier(0.33,0,0.22,1)',
                delay: index * 0.1, 
                scrollTrigger: {
                    trigger: el,
                    start: 'top 95%',
                    once: true,
                    toggleActions: 'play none none none',
                    markers: false
                }
            }
        );
    });
}