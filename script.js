document.addEventListener('DOMContentLoaded', initialize);

async function initialize() {
    await loadContent();
    setupRsvpForm();
    setupScrollAnimations();
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
        img.className = `w-1/3 h-24 object-cover animation-trigger animation-${index === 0 ? 'slide-in-left' : index === 2 ? 'slide-in-right' : 'fade-in'}`;
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

    // Date Section
    document.getElementById('month-year').textContent = content.dateSection.monthYear;
    document.getElementById('calendar').textContent = `(${content.dateSection.calendar})`;

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
        img.className = `h-32 object-cover animation-trigger animation-${index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'}`;
        albumImagesContainer.appendChild(img);
    });
    const blurredImage = document.getElementById('blurred-image');
    blurredImage.src = content.album.blurredImage.src;
    blurredImage.alt = content.album.blurredImage.alt;

    // Footer
    document.getElementById('thank-you').textContent = content.footer.thankYou;
    document.getElementById('welcome').textContent = content.footer.welcome;
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

function setupScrollAnimations() {
    const elements = document.querySelectorAll('.animation-trigger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.classList.contains('animation-fade-in') ? 'animate-fade-in' :
                    entry.target.classList.contains('animation-slide-in-left') ? 'animate-slide-in-left' :
                        entry.target.classList.contains('animation-slide-in-right') ? 'animate-slide-in-right' : '';
                if (animationType) {
                    entry.target.classList.add(animationType);
                    entry.target.classList.remove('animation-hidden');
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of element is visible
    });

    elements.forEach(element => {
        element.classList.add('animation-hidden');
        observer.observe(element);
    });
}