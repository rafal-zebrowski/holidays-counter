function loadComponent(id, file, callback) {
	fetch(file)
		.then(response => response.text())
		.then(data => {
			document.getElementById(id).innerHTML = data;
			if (callback) callback();
		})
		.catch(error => console.error(`Error loading ${file}:`, error));
}

function activeNavLinks() {
	const navLinks = document.querySelectorAll(".nav-link");

	navLinks.forEach(link => {
		link.addEventListener("click", function () {
			// Usuń klasę "active" ze wszystkich linków
			navLinks.forEach(link => link.classList.remove("active"));

			// Dodaj klasę "active" do klikniętego linku
			this.classList.add("active");

			// Opcjonalnie: zapisz wybraną stronę w localStorage, aby aktywny link pozostał po przeładowaniu
			localStorage.setItem("activeNav", this.getAttribute("data-counter"));
		});
	});

	// Ustaw aktywny link po odświeżeniu strony
	const activeNav = localStorage.getItem("activeNav");
	if (activeNav) {
		const activeLink = document.querySelector(`.nav-link[data-counter="${activeNav}"]`);
		if (activeLink) {
			activeLink.classList.add("active");
		}
	}
}

document.addEventListener("DOMContentLoaded", function() {
	loadComponent("menu-placeholder", "menu.html", activeNavLinks);
	loadComponent("footer-placeholder", "footer.html");
});

