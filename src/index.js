//grab ul and form nodes
let qList = document.querySelector("#quote-list")
let qForm = document.querySelector('#new-quote-form')

//get quotes and include likes
fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then((data) => {
        data.forEach((quote) => {
            turnQuoteIntoHTML(quote);
        })
    })

//add quote with form and append
qForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let author = e.target["author"].value
    let quote = e.target["new-quote"].value

    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            author: author,
            quote: quote
        })
    })
        .then(r => r.json())
        .then((quote) => {
            quote.likes = []
            turnQuoteIntoHTML(quote);
        })

})

//create cards and append to ul
function turnQuoteIntoHTML(quote) {
    let qCard = document.createElement("li")
    qCard.className = "quote-card"
    qCard.innerHTML = `<blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>`

    qList.append(qCard)


    //button grabbers
    const del = qCard.querySelector(".btn-danger")
    const like = qCard.querySelector(".btn-success")
    const likeCount = qCard.querySelector("span")

    //button event listeners
    like.addEventListener("click", (e) => {
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                quoteId: quote.id
            })
        })
            .then(res => res.json())
            .then((newLike) => {
                quote.likes.push(newLike)
                likeCount.innerText = quote.likes.length
            })
    })
    
    del.addEventListener("click", (e) => {
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(() => {
                qCard.remove()
            })

    })
}
