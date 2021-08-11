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
        console.log(date);

        var li = document.createElement("li");
        li.classList.add("d-flex");
        li.classList.add("justify-content-between");

        var outer_div = document.createElement("div");
        outer_div.classList.add("d-flex");
        outer_div.classList.add("flex-row");
        outer_div.classList.add("align-items-center");
        li.appendChild(outer_div);

        var inner_div_1 = document.createElement("div");
        inner_div_1.classList.add("ml-2");
        outer_div.appendChild(inner_div_1);

        var a = document.createElement("a");
        a.href =
          "https://ui.adsabs.harvard.edu/abs/" + docs.bibcode + "/abstract";
        a.target = "blank";
        inner_div_1.appendChild(a);

        var h6 = document.createElement("h6");
        h6.classList.add("mb-0");
        h6.innerText = docs.title;
        a.appendChild(h6);

        var br = document.createElement("br");
        outer_div.appendChild(br);

        var inner_div_2 = document.createElement("div");
        inner_div_2.classList.add("d-flex");
        inner_div_2.classList.add("flex-row");
        inner_div_2.classList.add("mt-1");
        inner_div_2.classList.add("text-black-50");
        inner_div_2.classList.add("date-time");
        outer_div.appendChild(inner_div_2);

        var nested_div = document.createElement("div");
        inner_div_2.appendChild(nested_div);

        var i = document.createElement("i");
        i.className = "fa fa-calendar-o";
        nested_div.appendChild(i);

        var span = document.createElement("span");
        span.classList.add("date");
        span.classList.add("ml-2");
        span.innerText = "Published " + date;
        i.appendChild(span);

        list.appendChild(li);
        return;
        `<li class="d-flex justify-content-between">
                <div class="d-flex flex-row align-items-center">
                  <div class="ml-2">
                    <a
                      href="https://ui.adsabs.harvard.edu/abs/" + ${docs.bibcode} + "/abstract"
                      target="blank"
                      ><h6 class="mb-0">
                        ${doc.title}
                      </h6></a
                    >
                    <div class="d-flex flex-row mt-1 text-black-50 date-time">
                      <div>
                        <i class="fa fa-calendar-o"></i
                        ><span class="date ml-2">Published ${docs.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>`;
      })
      .join("");
    list.insertAdjacentHTML("afterbegin", html);
  })
  .catch((error) => {
    console.log(error);
  });