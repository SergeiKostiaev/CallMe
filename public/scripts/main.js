const socket = io('/');
const muteButton = document.getElementById('mute-button');
const leaveButton = document.getElementById('leave-button');
const participantsDiv = document.getElementById('participants');
let isMuted = false;

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});

let myAudioStream;
const peers = {};

// Запрашиваем только аудио (без видео)
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
}).then(stream => {
    myAudioStream = stream;

    // Добавляем себя в список участников
    addParticipant('You', stream, true);

    peer.on('call', call => {
        call.answer(stream); // Отвечаем на звонок только аудио потоком
        call.on('stream', userAudioStream => {
            addParticipant(call.peer, userAudioStream, false); // Добавляем нового участника
        });
    });

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
    });
});

// Когда соединение установлено, присоединяемся к комнате
peer.on('open', id => {
    const roomId = prompt("Enter Room ID:");
    socket.emit('join-room', roomId, id);
});

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
    removeParticipant(userId); // Удаляем участника при отключении
});

function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream); // Соединяемся только аудио
    call.on('stream', userAudioStream => {
        addParticipant(userId, userAudioStream, false); // Добавляем нового участника
    });
    peers[userId] = call;
}

// Функция для управления микрофоном
muteButton.addEventListener('click', () => {
    if (!myAudioStream) return;

    isMuted = !isMuted;
    myAudioStream.getAudioTracks()[0].enabled = !isMuted;
    muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
});

// Функция выхода из комнаты
leaveButton.addEventListener('click', () => {
    socket.disconnect();
    peer.disconnect();
    window.location.href = '/'; // Возвращаемся на главную страницу после выхода
});

// Добавляем нового участника в интерфейс
function addParticipant(userId, stream, isSelf) {
    const participantDiv = document.createElement('div');
    participantDiv.classList.add('participant');
    participantDiv.setAttribute('id', userId);

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.innerHTML = isSelf ? 'You' : userId;

    const audioIndicator = document.createElement('div');
    audioIndicator.classList.add('audio-indicator');

    participantDiv.appendChild(avatar);
    participantDiv.appendChild(audioIndicator);
    participantsDiv.appendChild(participantDiv);

    // Проверка активности голоса
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
        if (volume > 50) {
            audioIndicator.classList.add('speaking');
            if (isSelf) avatar.classList.add('speaking-animation'); // Добавляем анимацию для себя
        } else {
            audioIndicator.classList.remove('speaking');
            if (isSelf) avatar.classList.remove('speaking-animation');
        }
    }, 200);
}

// Удаляем участника из интерфейса
function removeParticipant(userId) {
    const participantDiv = document.getElementById(userId);
    if (participantDiv) {
        participantDiv.remove();
    }
}
