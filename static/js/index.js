const form = document.querySelector("form");
const input = document.querySelector("input");
const resContainer = document.querySelector('.results-container')
const results = document.querySelector(".results");
const load = document.querySelector("img");
const pos = document.getElementById("positive");
const neg = document.getElementById("negative");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  results.innerHTML = "";
  const url = input.value;
  results.scrollIntoView()
  load.classList.remove("display-none");
  fetch(`/test/${url}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let message = "";
      
      load.classList.add("display-none");
      const headerTitle = document.createElement("h2");
      const headerScore = document.createElement("h2");
      const tip = document.createElement("p");
      const improv = document.createElement("h3");

      if (data.categories.accessibility.score >= 0.9) {
        message = "Dat is best een goede score!";

        pos.classList.remove("display-none");
        tip.className = "green";
        headerScore.className = "green";
      }
      if (data.categories.accessibility.score <= 0.9) {
        message = "Dat moet echt wel even beter!";
        tip.className = "orange";
        headerScore.className = "orange";
      }
      if (data.categories.accessibility.score <= 0.7) {
        message = "Dit is een waardeloze website!";
        neg.classList.remove("display-none");
        tip.className = "red";
        headerScore.className = "red";
      }
      tip.innerText = message;
      headerTitle.innerHTML = `${data.categories.accessibility.title} <a href="${data.finalUrl}">${data.finalUrl}</a>`;
      headerScore.innerText = "score: " + data.categories.accessibility.score;
      improv.innerText = "Verbeterpunten:";

      results.append(headerTitle);
      results.append(headerScore);
      results.append(tip);
      results.append(improv);
      const entries = Object.entries(data.audits);
      console.log(entries);
      entries.forEach((element) => {
        if (element[1].score == 0) {
          console.log(element[1].score);
          
          const container = document.createElement("div");
          const audit = document.createElement("h4");
          const desc = document.createElement("p");
          
          audit.classList.add("orange");
          audit.innerText = element[1].id;
          desc.innerHTML = element[1].description;

          container.append(audit);
          container.append(desc);
          results.append(container);
          
          const listing = document.createElement('ul')
          const label = document.createElement('label')
          const showMore = document.createElement('input')
          showMore.setAttribute('id', 'more')
          showMore.setAttribute('type', 'checkbox')
          label.setAttribute('for', 'more')
          label.innerText = 'Laat betreffende elementen zien'
          listing.append(label)
          listing.append(showMore)
          element[1].details.items.map(error =>{
            const errorEx = document.createElement('li')
            const errorSnip = document.createElement('span')
            errorEx.innerText = error.node.explanation
            errorSnip.innerText = error.node.snippet

            errorEx.append(errorSnip)
            listing.append(errorEx)
            container.append(listing)
          })
        }
      });
    });
});
