document.addEventListener('DOMContentLoaded', function() {
    const countdownDisplay = document.getElementById('countdown-display');
    const vacationMessage = document.getElementById('vacation-message');
    const pageTitle = document.querySelector('h1');
    const pageSubtitle = document.querySelector('.lead');

    // Holiday dates configuration
    const holidays = {
        wakacje: {
            title: 'Summer Vacation Countdown',
            subtitle: 'Get ready for an amazing summer break!',
            dates: year => ({
                start: new Date(`June 28, ${year}`),
                end: new Date(`August 31, ${year}`)
            })
        },
        ferie: {
            title: 'Winter Break Countdown',
            subtitle: 'Time for winter adventures!',
            dates: year => ({
                start: new Date(`January 15, ${year}`),
                end: new Date(`January 28, ${year}`)
            })
        },
        majowka: {
            title: 'May Day Break Countdown',
            subtitle: 'Spring holiday is coming!',
            dates: year => ({
                start: new Date(`May 1, ${year}`),
                end: new Date(`May 3, ${year}`)
            })
        },
        bozenarodzenie: {
            title: 'Christmas Countdown',
            subtitle: 'Getting ready for the magical time!',
            dates: year => ({
                start: new Date(`December 24, ${year}`),
                end: new Date(`December 26, ${year}`)
            })
        },
        wielkanoc: {
            title: 'Easter Countdown',
            subtitle: 'Spring celebration is approaching!',
            dates: year => {
                // Easter 2025: April 20
                return {
                    start: new Date(`April 20, ${year}`),
                    end: new Date(`April 21, ${year}`)
                };
            }
        },
        sylwester: {
            title: 'New Year Countdown',
            subtitle: 'Counting down to the new beginning!',
            dates: year => ({
                start: new Date(`December 31, ${year}`),
                end: new Date(`January 1, ${year + 1}`)
            })
        }
    };

    let currentHoliday = 'wakacje';

    function updateHolidayDisplay(holidayKey) {
        const holiday = holidays[holidayKey];
        pageTitle.textContent = holiday.title;
        pageSubtitle.textContent = holiday.subtitle;

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.counter === holidayKey) {
                link.classList.add('active');
            }
        });
    }

    function getNextVacationYear() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const holidayDates = holidays[currentHoliday].dates(currentYear);

        if (currentDate > holidayDates.end) {
            return currentYear + 1;
        }
        return currentYear;
    }

    function updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const holidayDates = holidays[currentHoliday].dates(currentYear);
        const nextHolidayDates = holidays[currentHoliday].dates(currentYear + 1);

        // Check if we're in holiday period
        if (now >= holidayDates.start && now <= holidayDates.end) {
            countdownDisplay.classList.add('d-none');
            vacationMessage.classList.remove('d-none');
            vacationMessage.textContent = `${holidays[currentHoliday].title.replace(' Countdown', '')} is in progress!`;
            return;
        }

        // Show countdown and hide vacation message
        countdownDisplay.classList.remove('d-none');
        vacationMessage.classList.add('d-none');

        // Determine target date
        let targetDate = now > holidayDates.end ? nextHolidayDates.start : holidayDates.start;

        // Calculate time difference
        const diff = targetDate - now;

        // Convert to days, hours, minutes, seconds
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update DOM
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // Navigation click handlers
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentHoliday = e.target.dataset.counter;
            updateHolidayDisplay(currentHoliday);
            updateCountdown();
        });
    });

    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial update
});