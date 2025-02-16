let currentTimer = null;

function initializeCounter(holidayType) {
    fetch('data/dates.json')
        .then(response => response.json())
        .then(data => {
            const holiday = data[holidayType];
            if (!holiday) return;

            updateCounter(holiday);

            if (currentTimer) {
                clearInterval(currentTimer);
            }

            currentTimer = setInterval(() => updateCounter(holiday), 1000);
        })
        .catch(error => console.error('Error loading dates:', error));
}

function getHolidayDates(holiday) {
    const now = new Date();
    const currentYear = now.getFullYear();

    if (holiday.type === "fixed") {
        let startDate = new Date(holiday.start.replace('YYYY', currentYear));
        let endDate = new Date(holiday.end.replace('YYYY', currentYear));

        // If we've passed this year's dates, use next year's dates
        if (now > endDate) {
            startDate = new Date(holiday.start.replace('YYYY', currentYear + 1));
            endDate = new Date(holiday.end.replace('YYYY', currentYear + 1));
        }

        return { startDate, endDate };
    } else if (holiday.type === "yearly") {
        // Find the next occurrence of the holiday
        const futureDates = holiday.dates.filter(date => {
            const endDate = new Date(date.end);
            return endDate >= now;
        }).sort((a, b) => new Date(a.start) - new Date(b.start));

        if (futureDates.length === 0) {
            console.error('No future dates available for this holiday');
            return null;
        }

        const nextDate = futureDates[0];
        return {
            startDate: new Date(nextDate.start),
            endDate: new Date(nextDate.end)
        };
    }

    return null;
}

function updateTitle(year) {
    const titleElement = document.querySelector(".countdown-container h1");

    if (!titleElement) return;

    titleElement.textContent = titleElement.textContent.replace("${year}", year || "");
}

function updateCounter(holiday) {
    const now = new Date();
    const dates = getHolidayDates(holiday);

    if (!dates) {
        console.error('Could not determine holiday dates');
        return;
    }

    const { startDate, endDate } = dates;
    updateTitle(startDate.getFullYear());
    const counterElement = document.getElementById('countdown-display');
    const messageElement = document.getElementById('vacation-message');

    // Check if holiday is ongoing
    if (now >= startDate && now <= endDate) {
        counterElement.classList.add('d-none');
        messageElement.classList.remove('d-none');
        return;
    }

    // Show counter and hide message
    counterElement.classList.remove('d-none');
    messageElement.classList.add('d-none');

    // Calculate time difference
    const diff = startDate - now;

    // Convert time difference to days, hours, minutes, seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Update the display
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}


