// API de citações aleatórias
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Exibir citações aleatórias
const renderNewQuote = async () => {
    // Buscar conteúdo da URL da API de citações
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;

    // Array de caracteres na citação
    let arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "</span>";
    });
    quoteSection.innerHTML += arr.join("");
};

// Lógica para comparar as palavras digitadas com a citação
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);

    // Array de caracteres digitados pelo usuário
    let userInputChars = userInput.value.split("");
    // Percorrer cada caractere na citação
    quoteChars.forEach((char, index) => {
        // Verificar caracteres com os caracteres da citação
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
        }
        // Se o usuário não digitou nada ou apagou
        else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            } else {
                char.classList.remove("fail");
            }
        }
        // Se o usuário digitou o caractere errado
        else {
            if (!char.classList.contains("fail")) {
                // Incrementar e exibir erros
                mistakes++;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        // Retornar true se todos os caracteres estiverem corretos
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });

        // Encerrar o teste se todos os caracteres estiverem corretos
        if (check) {
            displayResult();
        }
    });
});

// Atualizar cronômetro
function updateTimer() {
    if (time == 0) {
        // Encerrar teste se chegar a 0
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

// Configurar cronômetro
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

// Encerrar teste
const displayResult = () => {
    // Exibir div de resultado
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
};

// Iniciar teste
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
};

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}
