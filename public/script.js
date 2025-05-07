let filmovi = [];
let filtriraniFilmovi = [];
window.addEventListener('DOMContentLoaded', () =>{
    fetch('filmovi.csv')
        .then(res=>res.text())
        .then(csv=>{
            const rezultat = Papa.parse(csv,{
                header: true,
                skipEmptyLines: true
            });
            filmovi = rezultat.data.map(film =>({
                title: film.title,
                year: Number(film.year),
                genre: film.genre,
                directors: film.directors?.split(',').map(c => c.trim()) || [],
                duration: Number(film.duration),
                country: film.country?.split(',').map(c => c.trim()) || [],
                total_votes: Number(film.total_votes)
            }));
            filmovi = filmovi.slice(0, 20);
            filtriraniFilmovi = filmovi;
            console.log(filmovi);
            fillTable(filmovi);
            fillSortByGenre(filmovi);
            fillSortByCountry(filmovi);
            const rangeInput = document.getElementById('filter-length');
            const lengthDisplay = document.getElementById('length-value');
            rangeInput.addEventListener('input', () => {
                lengthDisplay.textContent = rangeInput.value;
            });
            document.getElementById('primijeni-filtere').addEventListener('click', filtriraj);
        })
})

function fillTable(filmovi){
    const tbody = document.querySelector('.movies tbody');
    tbody.innerHTML = '';
    if (filmovi.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">Nema
        filmova za odabrane filtre.</td></tr>`;
        return;
    }
    for (const film of filmovi){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${film.title}</td>
            <td>${film.year}</td>
            <td>${film.genre}</td>
            <td>${film.directors.join(', ')}</td>
            <td>${film.duration}</td>
            <td>${film.country.join(', ')}</td>
            <td>${film.total_votes}</td>
            <td>
                <button class="posudi-btn" data-title="${film.title}">Posudi</button>
            </td>
        `;
        tbody.appendChild(row);
    }
    const buttons = document.querySelectorAll('.posudi-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
          const title = this.getAttribute('data-title');
          dodajUKosaricu(title);
        });
      });
}

function fillSortByCountry(filmovi){
    const allCountries = [...new Set(
        filmovi.flatMap(film => film.country)
      )];

    const container = document.querySelector('#filter-country');
    
    allCountries.forEach(country => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" name="country" value="${country}"> ${country}`;
        container.appendChild(label);
    });
}

function fillSortByGenre(filmovi){
    const allGenres = [...new Set(
        filmovi.flatMap(film => film.genre)
      )];

    const select = document.querySelector('#filter-genre');
    select.innerHTML = '<option value="">-- Odaberi zanr --</option>';
    
    allGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        select.appendChild(option);
      });
}

function filtriraj() {
    const zanr = document.getElementById('filter-genre')?.value || ''
    console.log(zanr);
    const godinaOd = parseInt(document.getElementById('filter-year').value);
    console.log(godinaOd);
    // TODO: handle multiple countries with check boxes
    const drzave = Array.from(document.querySelectorAll('input[name="country"]:checked'))
    .map(checkbox => checkbox.value)
    .filter(value => value !== '');
    console.log(drzave);
    const duljina = parseInt(document.getElementById('filter-length').value);
    console.log(duljina);
    filtriraniFilmovi = filmovi.filter(film => {
        const zanrMatch = !zanr || film.genre === zanr
        const godinaOdMatch = !godinaOd || film.year >= godinaOd;
        const drzavaMatch = drzave.length === 0 || drzave.some(country => film.country.includes(country));
        const duljinaMatch = film.duration >= duljina;
        return zanrMatch && godinaOdMatch && drzavaMatch && duljinaMatch;
    });
    console.log(filtriraniFilmovi);
    fillTable(filtriraniFilmovi);
}

let kosarica = [];
function dodajUKosaricu(film) {
    if (!kosarica.includes(film)) {
        kosarica.push(film);
        osvjeziKosaricu();
    } else {
        alert("Film je vec u kosarici!");
    }
}
function osvjeziKosaricu() {
    const lista = document.getElementById('lista-kosarice');
    lista.innerHTML = '';
    kosarica.forEach((film, index) => {
        const li = document.createElement('li');
        li.textContent = film;
        console.log(film);
        const ukloniBtn = document.createElement('button');
        ukloniBtn.textContent = 'Ukloni';
        ukloniBtn.addEventListener('click', () => {
            ukloniIzKosarice(index);
        });
        li.appendChild(ukloniBtn);
        lista.appendChild(li);
    });
}

function sortByYears(){
    filtriraniFilmovi.sort((a,b) => a.year - b.year);
    fillTable(filtriraniFilmovi);
}
function ukloniIzKosarice(index) {
    kosarica.splice(index, 1);
    osvjeziKosaricu();
}
// Potvrda kosarice
document.getElementById('potvrdi-kosaricu').addEventListener('click', () => {
    if (kosarica.length === 0) {
    alert("Kosarica je prazna!");
    } else {
    alert(`Uspjesno ste odabrali ${kosarica.length} filmova za gledanje!`);
    kosarica = [];
    osvjeziKosaricu();
    }
});