document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    try {
        // Đăng ký ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        setupAnimations();
    } catch (error) {
        console.error('GSAP lỗi:', error);
        // Fallback: Hiện tất cả phần tử
        document.querySelectorAll('.animate-element').forEach(el => {
            el.style.opacity = 1;
            el.style.transform = 'none';
        });
    }
}

function setupAnimations() {
    const elements = document.querySelectorAll('.animate-element');
    elements.forEach((el, index) => {
        const animationType = el.dataset.animate;
        let animationProps = {};

        // Định nghĩa thuộc tính animation dựa trên data-animate
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

        // Thiết lập GSAP animation
        gsap.fromTo(
            el,
            animationProps,
            {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 2.5,
                ease: 'cubic-bezier(0.33,0,0.22,1)',
                delay: index * 0.2, // Độ trễ tuần tự
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play reverse play reverse', // Chạy khi vào, đảo ngược khi ra
                    markers: false
                }
            }
        );
    });
}