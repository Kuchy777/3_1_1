const input = document.getElementById("capitalInput");
const button = document.getElementById("searchBtn");
const tableBody = document.getElementById("resultsBody");
const errorBox = document.getElementById("error");
const status = document.getElementById("status");

button.addEventListener("click", () => {
  const capital = input.value.trim();
  if (!capital) {
    errorBox.textContent = "Podaj nazwę stolicy.";
    errorBox.style.display = "block";
    return;
  }
  searchCountry(capital);
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter") button.click();
});

async function searchCountry(capital) {
  errorBox.style.display = "none";
  tableBody.innerHTML = "";
  status.textContent = "Wyszukiwanie...";
  
  button.disabled = true;

  try {
    const res = await fetch(`https://restcountries.com/v3.1/capital/${encodeURIComponent(capital)}`);
    
    if (!res.ok) throw new Error("Nie znaleziono kraju");
    
    const data = await res.json();

    const rows = data.map(country => `<tr>
      <td>${country.name?.common || "brak danych"}</td>
      <td>${country.capital?.[0] || "brak danych"}</td>
      <td>${country.population?.toLocaleString('pl-PL') || "brak danych"}</td>
      <td>${country.region || "brak danych"}</td>
      <td>${country.subregion || "brak danych"}</td>
    </tr>`).join('');
    
    tableBody.innerHTML = rows;
    status.textContent = "";
    
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="5">Błąd: ${err.message}</td></tr>`;
    errorBox.textContent = err.message;
    errorBox.style.display = "block";
    status.textContent = "";
  } finally {
    button.disabled = false;
  }
}
