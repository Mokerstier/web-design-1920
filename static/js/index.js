const form = document.querySelector("form");
const input = document.querySelector("input");
const results = document.querySelector(".results");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = input.value;

  fetch(`/${url}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let message = ''
      results.innerHTML = ''

      const headerTitle = document.createElement('h2')
      const headerScore = document.createElement('h2')
      const tip = document.createElement('p')
      const improv = document.createElement('h4')

      if(data.categories.accessibility.score >= 0.9){
        message = 'Dat is best een goede score!'
        tip.className = 'green'
      }
      if(data.categories.accessibility.score <= 0.9){
        message = 'Dat moet echt wel even beter!'
        tip.className = 'orange'
      }
      if(data.categories.accessibility.score <= 0.7){
        message = 'Dit is een waardeloze website!'
        tip.className = 'red'
      }
      tip.innerText = message
      headerTitle.innerHTML = `${data.categories.accessibility.title} <a href="${data.finalUrl}">${data.finalUrl}</a>`
      headerScore.innerText = 'score: '+data.categories.accessibility.score
      improv.innerText = 'Verbeterpunten:'

      results.append(headerTitle)
      results.append(headerScore)
      results.append(tip)
      results.append(improv)
      const entries = Object.entries(data.audits);
      console.log(entries);
      entries.forEach((element) => {
          if (element[1].score == 0){
              console.log(element[1].score)
            
            const container = document.createElement("div");
            const audit = document.createElement("h3");
            const desc = document.createElement("p");
            audit.innerText = element[1].id;
            desc.innerHTML = element[1].description;
            
            
            container.append(audit);
            container.append(desc);
            results.append(container);
          }
       
      });
    });
});
