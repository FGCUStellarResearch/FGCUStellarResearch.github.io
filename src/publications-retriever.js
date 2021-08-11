const list = document.querySelector(".list");

fetch(
  "https://api.adsabs.harvard.edu/v1/search/query?" +
    new URLSearchParams({
      q: 'author:"Buzasi, Derek"',
      rows: 10,
      fl: "title, date, bibcode",
      sort: "date desc",
    }),
  {
    method: "GET",
    headers: {
      Authorization: "Bearer",
    },
  }
)
  .then((response) => {
    if (!response.ok) {
      throw Error("Error");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data.response.docs);
    const html = data.response.docs
      .map((docs) => {
        date = new Date(docs.date).toLocaleString("en-us", {
          month: "long",
          year: "numeric",
          day: "numeric",
        });
        
        return `<li class="d-flex justify-content-between">
          <div class="d-flex flex-row align-items-center">
            <div class="ml-2">
              <a
                href="https://ui.adsabs.harvard.edu/abs/" + ${docs.bibcode} + "/abstract"
                target="blank"
                ><h6 class="mb-0">
                  ${docs.title}
                </h6></a
              >
              <div class="d-flex flex-row mt-1 text-black-50 date-time">
                <div>
                  <i class="fa fa-calendar-o"></i
                  ><span class="date ml-2">Published ${date}</span>
                </div>
              </div>
            </div>
          </div>
        </li>`;
      })
      .join("");
    list.insertAdjacentHTML("beforeend", html);
  })
  .catch((error) => {
    console.log(error);
  });