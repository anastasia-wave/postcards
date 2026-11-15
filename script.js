const themes = ["emo", "kitty", "normis", "night", "sea"];
const textInput = document.getElementById("text");
const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const themeSelect = document.getElementById("theme");
const sendButton = document.getElementById("send");
const statusBlock = document.getElementById("status");

function readMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem("messages") || "[]");
    return Array.isArray(saved)
      ? saved.filter(
          (message) =>
            message &&
            typeof message.text === "string" &&
            typeof message.from === "string" &&
            typeof message.to === "string",
        )
      : [];
  } catch (error) {
    statusBlock.textContent = "Не удалось прочитать историю открыток.";
    return [];
  }
}

function fillCard(card, message) {
  const theme = themes.includes(message.theme) ? message.theme : "kitty";
  card.className = "message-card " + theme;
  card.replaceChildren();
  const info = document.createElement("div");
  info.className = "message-info";
  const from = document.createElement("span");
  from.textContent = "От: " + message.from;
  const to = document.createElement("span");
  to.textContent = "Кому: " + message.to;
  const text = document.createElement("p");
  text.className = "message-text";
  text.textContent = message.text;
  info.append(from, to);
  card.append(info, text);
}

function updatePreview() {
  sendButton.disabled = ![textInput, fromInput, toInput].every((input) =>
    input.value.trim(),
  );
  fillCard(document.getElementById("preview"), {
    text: textInput.value.trim() || "Здесь будет текст вашей открытки ♡",
    from: fromInput.value.trim() || "Ваше имя",
    to: toInput.value.trim() || "Имя получателя",
    theme: themeSelect.value,
  });
}

function showMessages() {
  const messagesBlock = document.getElementById("messages");
  messagesBlock.replaceChildren();
  const messages = readMessages();
  if (!messages.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Здесь пока ничего нет...";
    messagesBlock.append(empty);
  }
  messages.forEach((message) => {
    const card = document.createElement("article");
    fillCard(card, message);
    messagesBlock.append(card);
  });
}

function sendMessage() {
  if (![textInput, fromInput, toInput].every((input) => input.value.trim()))
    return;
  const messages = readMessages();
  messages.push({
    text: textInput.value.trim(),
    from: fromInput.value.trim(),
    to: toInput.value.trim(),
    theme: themeSelect.value,
  });
  try {
    localStorage.setItem("messages", JSON.stringify(messages));
  } catch (error) {
    statusBlock.textContent =
      "Не удалось сохранить открытку. Проверьте доступ к хранилищу браузера.";
    return;
  }
  textInput.value = "";
  fromInput.value = "";
  toInput.value = "";
  statusBlock.textContent = "Открытка добавлена в историю ♡";
  showMessages();
  updatePreview();
}

[textInput, fromInput, toInput].forEach((input) =>
  input.addEventListener("input", updatePreview),
);
themeSelect.addEventListener("change", updatePreview);
window.addEventListener("storage", (event) => {
  if (event.key === "messages" || event.key === null) showMessages();
});
showMessages();
updatePreview();
