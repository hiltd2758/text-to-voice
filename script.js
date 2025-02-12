const speakButton = document.getElementById('speak-btn');
const pauseButton = document.getElementById('pause-btn');
const textArea = document.getElementById('text-to-voice');
const voiceSelect = document.getElementById('voice-select');


const volumeSlider = document.getElementById('volumeSlider');
const pitchSlider = document.getElementById('pitchSlider');
const rateSlider = document.getElementById('rateSlider');

const volumeDisplay = document.getElementById('volumeValue');
const pitchDisplay = document.getElementById('pitchValue');
const rateDisplay = document.getElementById('rateValue');


if ('speechSynthesis' in window) {
    let voices = [];
    let currentUtterance = null;
    let isPaused = false;


    function populateVoicesList() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '<option value="" disabled selected>Select a voice</option>';
        voices.forEach((voice) => {
            const option = document.createElement('option');
            option.textContent = voice.name + (voice.default ? ' (Default)' : '');
            option.value = voice.name;
            voiceSelect.appendChild(option);
        });
    }

    speechSynthesis.onvoiceschanged = populateVoicesList;
    populateVoicesList();


    speakButton.addEventListener('click', function () {
        const text = textArea.value.trim();
        if (text === "") {
            alert("Please enter some text to speak!");
            return;
        }


        speechSynthesis.cancel();
        isPaused = false;

        const selectedVoiceName = voiceSelect.value;
        const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);

        if (!selectedVoice) {
            alert("Please select a valid voice!");
            return;
        }

        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.voice = selectedVoice;
        currentUtterance.volume = parseFloat(volumeSlider.value);
        currentUtterance.pitch = parseFloat(pitchSlider.value);
        currentUtterance.rate = parseFloat(rateSlider.value);

        speechSynthesis.speak(currentUtterance);
    });

    pauseButton.addEventListener('click', function() {
        if (!currentUtterance) return;

        if (isPaused) {

            speechSynthesis.resume();
            isPaused = false;
            pauseButton.textContent = 'Pause';
        } else {
            speechSynthesis.pause();
            isPaused = true;
            pauseButton.textContent = 'Resume';
        }
    });


    speechSynthesis.addEventListener('end', function() {
        currentUtterance = null;
        isPaused = false;
        if (pauseButton) pauseButton.textContent = 'Pause';
    });
} else {
    alert("Sorry, your browser does not support speech synthesis.");
}


const sliders = {
    volume: {
        element: document.getElementById('volumeSlider'),
        value: document.getElementById('volumeValue')
    },
    pitch: {
        element: document.getElementById('pitchSlider'),
        value: document.getElementById('pitchValue')
    },
    rate: {
        element: document.getElementById('rateSlider'),
        value: document.getElementById('rateValue')
    }
};

Object.values(sliders).forEach(slider => {
    slider.element.addEventListener('input', () => {
        const percentage = Math.round(slider.element.value * 100);
        slider.value.textContent = `${percentage}%`;
    });
});