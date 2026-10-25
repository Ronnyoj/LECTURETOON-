// Social Sharing for Lecture cartoon 

class SocialSharing {
    constructor() {
        this.url = window.location.href;
        this.title = document.title;
        this.description = document.querySelector('meta[name="description"]')?.content || '';
    }

    /**
     * Share on Twitter/X
     */
    shareTwitter(customText = null) {
        const text = customText || this.title;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.url)}`;
        this.openPopup(url, 'Twitter');
    }

    /**
     * Share on Facebook
     */
    shareFacebook() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.url)}`;
        this.openPopup(url, 'Facebook');
    }

    /**
     * Share on LinkedIn
     */
    shareLinkedIn() {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.url)}`;
        this.openPopup(url, 'LinkedIn');
    }

    /**
     * Share on WhatsApp
     */
    shareWhatsApp(customText = null) {
        const text = customText || this.title;
        const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + this.url)}`;
        this.openPopup(url, 'WhatsApp');
    }

    /**
     * Share via Email
     */
    shareEmail(subject = null, body = null) {
        const emailSubject = subject || this.title;
        const emailBody = body || `${this.description}\n\n${this.url}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    }

    /**
     * Copy link to clipboard
     */
    async copyLink() {
        try {
            await navigator.clipboard.writeText(this.url);
            alert('Link copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = this.url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            alert('Link copied to clipboard!');
        }
    }

    /**
     * Use native Web Share API if available
     */
    async nativeShare() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.title,
                    text: this.description,
                    url: this.url
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        } else {
            // Fallback: show share options
            this.showShareMenu();
        }
    }

    /**
     * Open popup window for sharing
     */
    openPopup(url, name) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        window.open(url, name, `width=${width},height=${height},left=${left},top=${top}`);
    }

    /**
     * Show custom share menu
     */
    showShareMenu() {
        // This is a placeholder - implement your custom UI here
        console.log('Share menu would appear here');
    }
}

// Initialize global sharing instance
const socialSharing = new SocialSharing();

// Add event listeners to share buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-share="twitter"]').forEach(btn => {
        btn.addEventListener('click', () => socialSharing.shareTwitter());
    });

    document.querySelectorAll('[data-share="facebook"]').forEach(btn => {
        btn.addEventListener('click', () => socialSharing.shareFacebook());
    });

    document.querySelectorAll('[data-share="linkedin"]').forEach(btn => {
        btn.addEventListener('click', () => socialSharing.shareLinkedIn());
    });

    document.querySelectorAll('[data-share="whatsapp"]').forEach(btn => {
        btn.addEventListener('click', () => socialSharing.shareWhatsApp());
    });

    document.querySelectorAll('[data-share="email"]').forEach(btn => {
        btn.addEventListener('click', () => socialSharing.shareEmail());
    });

    document.querySelectorAll('[data-share="copy"]').forEach(btn => {
        btn.addEventListener('click', () => socialSharing.copyLink());
    });

    document.querySelectorAll('[data-share="native"]').forEach(btn => {
        btn.addEventListener('click', () => socialSharing.nativeShare());
    });
});