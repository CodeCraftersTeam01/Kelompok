document.addEventListener('DOMContentLoaded', function () {
    const typedTextSpan = document.getElementById('typed-text');
    const cursorSpan = document.getElementById('cursor');

    const textArray = ["Arjuna Lanang Adiwarsana", "Tegar Mahardika", "Esy Aulia Tri Ananta", "Ahmad Yasar Maulana Dais"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay before starting to erase
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    // start the typing effect
    setTimeout(type, newTextDelay);

    document.querySelectorAll('input[type=radio]').forEach(radio => {
        radio.checked = false; // kosongkan semua
    });

    const radios = document.querySelectorAll('.card input[type=radio]');
    const cards = document.querySelectorAll('.card');

    radios.forEach(radio => {
        radio.addEventListener('click', function () {
            if (this.wasChecked) {
                // kalau diklik lagi -> uncheck & reset semua card
                this.checked = false;
                cards.forEach(card => card.classList.remove('blurred'));
            }
            // simpan status terakhir
            this.wasChecked = this.checked;
        });

        radio.addEventListener('change', function () {
            // hanya jalan kalau memang ada radio yang checked
            if (this.checked) {
                cards.forEach(card => {
                    if (card.querySelector('input[type=radio]').checked) {
                        card.classList.remove('blurred'); // yang dipilih jelas
                    } else {
                        card.classList.add('blurred'); // yang lain blur
                    }
                });
            }
        });
    });


});