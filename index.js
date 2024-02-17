window.addEventListener("DOMContentLoaded", () => {
  Keyboard.init();
});

async function sendRequest(payload) {
  try {
    const response = await fetch("http://192.168.0.73:5000/keypress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log("Request successful.");
    } else {
      console.log("Request failed.");
    }
  } catch (error) {
    console.log("Request failed");
    console.log(error);
  }
}

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
    activeSpecialKeys: [],
    activeKeys: [],
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys =
      this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.getElementById("container").appendChild(this.elements.main);

    this.open((currentValue) => {
      console.log(currentValue);
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "esc",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "backspace",
      "tab",
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "caps",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "enter",
      "shift",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      ",",
      ".",
      "?",
      "up",
      "cmd",
      "ctrl",
      "alt",
      "space",
      "left",
      "down",
      "right",
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      const insertLineBreak =
        ["backspace", "p", "enter", "up"].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          this._handleRequest(keyElement, key);

          break;

        case "up":
          keyElement.innerHTML = createIconHTML("keyboard_arrow_up");

          this._handleRequest(keyElement, key);

          break;
        case "left":
          keyElement.innerHTML = createIconHTML("keyboard_arrow_left");

          this._handleRequest(keyElement, key);

          break;
        case "right":
          keyElement.innerHTML = createIconHTML("keyboard_arrow_right");

          this._handleRequest(keyElement, key);

          break;
        case "down":
          keyElement.innerHTML = createIconHTML("keyboard_arrow_down");

          this._handleRequest(keyElement, key);

          break;

        case "caps":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--activatable"
          );
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle(
              "keyboard__key--active",
              this.properties.capsLock
            );
          });

          this._handleRequest(keyElement, key);

          break;

        case "tab":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = "tab";

          this._handleRequest(keyElement, key);

          break;

        case "cmd":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_command");

          keyElement.addEventListener("touchstart", () => {
            this.properties.activeSpecialKeys.push(key);
          });

          keyElement.addEventListener("touchend", () => {
            this.properties.activeSpecialKeys =
              this.properties.activeSpecialKeys.filter((sk) => sk !== key);
          });

          break;

        case "ctrl":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = "ctrl ^";

          keyElement.addEventListener("touchstart", () => {
            this.properties.activeSpecialKeys.push(key);
          });

          keyElement.addEventListener("touchend", () => {
            this.properties.activeSpecialKeys =
              this.properties.activeSpecialKeys.filter((sk) => sk !== key);
          });

          break;

        case "alt":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = "alt";

          keyElement.addEventListener("touchstart", () => {
            this.properties.activeSpecialKeys.push(key);
          });

          keyElement.addEventListener("touchend", () => {
            this.properties.activeSpecialKeys =
              this.properties.activeSpecialKeys.filter((sk) => sk !== key);
          });

          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = "shift";

          keyElement.addEventListener("touchstart", () => {
            this.properties.activeSpecialKeys.push(key);
          });

          keyElement.addEventListener("touchend", () => {
            this.properties.activeSpecialKeys =
              this.properties.activeSpecialKeys.filter((sk) => sk !== key);
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          this._handleRequest(keyElement, key);

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          this._handleRequest(keyElement, key);

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("touchstart", () => {
            this.properties.activeKeys.push(key);
          });

          this._handleRequest(keyElement, key);

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
    }
  },

  _handleRequest(keyElement, key) {
    keyElement.addEventListener("touchend", async () => {
      // send request
      const payload = {
        key: this._capitalizeChars(key),
        meta: this.properties.activeSpecialKeys.includes("cmd"),
        ctrl: this.properties.activeSpecialKeys.includes("ctrl"),
        alt: this.properties.activeSpecialKeys.includes("alt"),
        shift: this.properties.activeSpecialKeys.includes("shift"),
      };
      await sendRequest(payload);

      this.properties.activeKeys = this.properties.activeKeys.filter(
        (k) => k !== key
      );
    });
  },

  _capitalizeChars(char) {
    if (char.length > 1) return char;
    const code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) {
      if (this.properties.capsLock) {
        return char.toUpperCase();
      }
    }
    return char;
  },

  open(oninput, onclose) {
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },
};
