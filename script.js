document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const serverUrl = document.getElementById('server-url').value.trim();
    const videoFile = document.getElementById('video-file').files[0];
    const audioFile = document.getElementById('audio-file').files[0];

    if (!serverUrl) {
        alert("Please enter a server URL.");
        return;
    }

    if (!videoFile) {
        alert("Please select a video file.");
        return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    if (audioFile) {
        formData.append('audio', audioFile);
    }

    // Show loading container
    document.getElementById('loading-container').classList.remove('hidden');

    const progressBar = document.getElementById('progress-bar');
    const etaElement = document.getElementById('eta');

    let progress = 0;
    const progressInterval = 100; // Update every 100ms
    const maxProgress = 100;
    const loadingDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

    // Simulate loading progress
    const intervalId = setInterval(() => {
        if (progress < maxProgress) {
            progress += (maxProgress / (loadingDuration / progressInterval));
            progressBar.value = Math.min(progress, maxProgress);
            etaElement.textContent = `Loading...PROCESSING`;
        }
    }, progressInterval);

    try {
        const response = await fetch(`${serverUrl}process-video/`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        clearInterval(intervalId); // Stop the simulated progress
        progressBar.value = 100; // Set progress bar to 100%

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Create a link element to download the video
        const a = document.createElement('a');
        a.href = url;
        a.download = 'processed_video.mp4';  // Default file name
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);  // Clean up

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    } finally {
        // Hide loading container
        document.getElementById('loading-container').classList.add('hidden');
    }
});
