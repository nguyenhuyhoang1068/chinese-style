document.addEventListener('DOMContentLoaded', initialize);

async function initialize() {
    await loadContent();
    setupRsvpForm();
    setupScrollAnimations();
    setupMusicControl();
}

async function loadContent() {
    try {
        const response = await fetch('./content.json');
        if (!response.ok) throw new Error(`Không thể tải content.json: ${response.statusText}`);
        const content = await response.json();
        renderContent(content);
    } catch (error) {
        console.error('Lỗi khi tải nội dung:', error);
        showMessage('Không thể tải nội dung thiệp mời. Vui lòng thử lại sau.', 'text-red-600');
    }
}

function renderContent(content) {
    // Header
    document.getElementById('page-title').textContent = content.title;
    document.getElementById('header-title').textContent = content.header.title;
    document.getElementById('header-couple').textContent = content.header.couple;
    document.getElementById('header-day').textContent = content.header.day;
    document.getElementById('header-date').textContent = content.header.date;

    // Main Image
    const mainImage = document.getElementById('main-image');
    mainImage.src = content.mainImage.src;
    mainImage.alt = content.mainImage.alt;

    // Family
    document.getElementById('groom-title').textContent = content.family.groom.title;
    document.getElementById('groom-father').textContent = content.family.groom.father;
    document.getElementById('groom-mother').textContent = content.family.groom.mother;
    document.getElementById('groom-location').textContent = content.family.groom.location;
    document.getElementById('bride-title').textContent = content.family.bride.title;
    document.getElementById('bride-father').textContent = content.family.bride.father;
    document.getElementById('bride-mother').textContent = content.family.bride.mother;
    document.getElementById('bride-location').textContent = content.family.bride.location;

    // Announcement
    document.getElementById('announcement-text').textContent = content.announcement.text;
    document.getElementById('announcement-groom').textContent = content.announcement.groom;
    document.getElementById('announcement-bride').textContent = content.announcement.bride;

    // Secondary Image
    const secondaryImage = document.getElementById('secondary-image');
    secondaryImage.src = content.secondaryImage.src;
    secondaryImage.alt = content.secondaryImage.alt;

    // Invitation
    document.getElementById('invite-text').textContent = content.invitation.inviteText;
    const smallImagesContainer = document.getElementById('small-images');
    content.invitation.smallImages.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.className = `w-1/3 h-25 object-contain animation-trigger animation-${index === 0 ? 'slide-in-left animation-float-up-down mt-20' : index === 2 ? 'slide-in-right animation-float-up-down mt-20' : 'float-up-down'}`;
        smallImagesContainer.appendChild(img);
    });
    document.getElementById('event-text').textContent = content.invitation.eventText;
    document.getElementById('time-label').textContent = content.invitation.timeLabel;
    document.getElementById('time').textContent = content.invitation.time;
    document.getElementById('date').textContent = content.invitation.date;
    document.getElementById('lunar-date').textContent = `(${content.invitation.lunarDate})`;
    document.getElementById('location-text').textContent = content.invitation.locationText;
    document.getElementById('venue').textContent = content.invitation.venue;
    document.getElementById('address').textContent = content.invitation.address;
    const mapButton = document.querySelector('.wedding-button[href]');
    const mapQuery = encodeURIComponent(content.invitation.address);
    mapButton.href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}&origin=${encodeURIComponent(window.location.href)}`;

    // Calendar
    const calendarDateStr = content.dateSection.calendar; // "18-10-2025"
    const [dayStr, monthStr, yearStr] = calendarDateStr.split('-'); // ['18', '10', '2025']
    const weddingDay = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    document.getElementById('month-year').textContent = content.dateSection.monthYear;
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = generateCalendar(year, month, weddingDay);

    // RSVP
    document.getElementById('rsvp-title').textContent = content.rsvp.title;
    document.getElementById('name-label').textContent = content.rsvp.nameLabel;
    document.getElementById('name').placeholder = content.rsvp.namePlaceholder;
    document.getElementById('relationship-label').textContent = content.rsvp.relationshipLabel;
    document.getElementById('relationship').placeholder = content.rsvp.relationshipPlaceholder;
    document.getElementById('message-label').textContent = content.rsvp.messageLabel;
    document.getElementById('message').placeholder = content.rsvp.messagePlaceholder;
    document.getElementById('attendance-label').textContent = content.rsvp.attendanceLabel;
    document.getElementById('submit-rsvp').textContent = content.rsvp.submitButton;
    document.getElementById('gift-text').textContent = content.rsvp.giftText;

    // Album
    document.getElementById('album-title').textContent = content.album.title;
    const albumImagesContainer = document.getElementById('album-images');
    content.album.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.className = `h-40 object-contain animation-trigger animation-${index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'}`;
        if (index % 2 === 0) {
            img.style.justifySelf = 'end';
        } else {
            img.style.justifySelf = 'start';
        }
        albumImagesContainer.appendChild(img);
    });
    const blurredImage = document.getElementById('blurred-image');
    blurredImage.src = content.album.blurredImage.src;
    blurredImage.alt = content.album.blurredImage.alt;

    // Footer
    document.getElementById('thank-you').textContent = content.footer.thankYou;
    document.getElementById('welcome').textContent = content.footer.welcome;

    // Music
    const audio = document.getElementById('wedding-music');
    audio.src = content.music.src;
}

function generateCalendar(year, month, weddingDay) {
    const daysInMonth = new Date(year, month, 0).getDate();
    let firstDay = new Date(year, month - 1, 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1; // Chuyển Chủ Nhật về cuối tuần

    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    let calendarHTML = `
        <table class="calendar-table">
            <thead>
                <tr>${days.map(day => `<th>${day}</th>`).join('')}</tr>
            </thead>
            <tbody>
    `;

    let day = 1;
    while (day <= daysInMonth) {
        calendarHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            if ((day === 1 && j < firstDay) || day > daysInMonth) {
                calendarHTML += '<td class="empty"></td>';
            } else {
                const isWeddingDay = day === weddingDay ? 'wedding-day' : '';
                calendarHTML += `<td class="${isWeddingDay}"><span>${day}</span></td>`;
                day++;
            }
        }
        calendarHTML += '</tr>';
    }

    calendarHTML += '</tbody></table>';
    return calendarHTML;
}

function setupRsvpForm() {
    const submitButton = document.getElementById('submit-rsvp');
    if (submitButton) {
        submitButton.addEventListener('click', handleRsvpSubmit);
    }
}

function handleRsvpSubmit() {
    const name = document.getElementById('name').value.trim();
    const relationship = document.getElementById('relationship').value.trim();
    const message = document.getElementById('message').value.trim();
    const attendance = document.getElementById('attendance').value;

    if (!name || !relationship || !message) {
        showMessage('Vui lòng điền đầy đủ thông tin.', 'text-red-600');
        return;
    }

    const rsvpData = {
        name,
        relationship,
        message,
        attendance
    };

    console.log('RSVP Data:', rsvpData);
    showMessage('Cảm ơn bạn đã xác nhận tham dự!', 'text-green-600');
    clearForm();
}

function showMessage(text, className) {
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = text;
    formMessage.className = `mt-2 text-sm ${className}`;
    formMessage.classList.remove('hidden');
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('relationship').value = '';
    document.getElementById('message').value = '';
    document.getElementById('attendance').value = 'yes';
}

function setupMusicControl() {
    const audio = document.getElementById('wedding-music');
    const musicControl = document.getElementById('music-control');

    // Pointerdown
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

    // Play/pause
    musicControl.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                musicControl.classList.add('playing');
            }).catch(error => {
                console.error('Lỗi khi phát nhạc:', error);
                showMessage('Không thể phát nhạc. Vui lòng nhấp lại vào biểu tượng nốt nhạc.', 'text-red-600');
            });
        } else {
            audio.pause();
            musicControl.classList.remove('playing');
        }
    });
}

function setupScrollAnimations() {
    const elements = document.querySelectorAll('.animation-trigger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.classList.contains('animation-fade-in') ? 'animation-fade-in' :
                    entry.target.classList.contains('animation-slide-in-left') ? 'animation-slide-in-left' :
                        entry.target.classList.contains('animation-slide-in-right') ? 'animation-slide-in-right' : '';
                if (animationType) {
                    entry.target.classList.add(animationType);
                    entry.target.classList.remove('animation-hidden');
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            }
        });
    }, {
        threshold: 0.01 // Trigger when 20% of element is visible
    });

    elements.forEach(element => {
        element.classList.add('animation-hidden');
        observer.observe(element);
    });
}