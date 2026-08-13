// ==========================================
// ELEMENTS
// ==========================================

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");


// ==========================================
// SCROLL TO BOTTOM
// ==========================================

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(type, text) {

    const message = document.createElement("div");

    message.className =
        type === "user"
            ? "message user-message"
            : "message bot-message";


    const avatar =
        type === "user"
            ? "👤"
            : "🤖";


    const avatarClass =
        type === "user"
            ? "user-avatar"
            : "bot-avatar";


    const name =
        type === "user"
            ? "You"
            : "Gemini";


    message.innerHTML = `
        <div class="avatar ${avatarClass}">
            ${avatar}
        </div>

        <div class="message-content">

            <div class="message-name">
                ${name}
            </div>

            <div class="message-text"></div>

        </div>
    `;


    const messageText =
        message.querySelector(".message-text");


    // Gemini response
    if (type === "bot") {

        messageText.innerHTML =
            formatMarkdown(text);

        addCopyButtons(messageText);

    }

    // User message
    else {

        messageText.textContent = text;

    }


    chatBox.appendChild(message);

    scrollToBottom();

    return message;
}


// ==========================================
// MARKDOWN FORMATTER
// ==========================================

function formatMarkdown(text) {

    if (!text) {
        return "";
    }


    // Escape HTML for security
    let safeText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");


    // ======================================
    // CODE BLOCKS
    // ======================================

    const codeBlocks = [];


    safeText = safeText.replace(
        /```(\w*)\n?([\s\S]*?)```/g,

        function (match, language, code) {

            const id =
                codeBlocks.length;


            codeBlocks.push({
                language:
                    language || "code",

                code:
                    code.trim()
            });


            return `___CODE_BLOCK_${id}___`;
        }
    );


    // ======================================
    // HEADINGS
    // ======================================

    safeText =
        safeText.replace(
            /^### (.*)$/gm,
            "<h3>$1</h3>"
        );


    safeText =
        safeText.replace(
            /^## (.*)$/gm,
            "<h2>$1</h2>"
        );


    safeText =
        safeText.replace(
            /^# (.*)$/gm,
            "<h1>$1</h1>"
        );


    // ======================================
    // BOLD
    // ======================================

    safeText =
        safeText.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    // ======================================
    // ITALIC
    // ======================================

    safeText =
        safeText.replace(
            /(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g,
            "<em>$1</em>"
        );


    // ======================================
    // INLINE CODE
    // ======================================

    safeText =
        safeText.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );


    // ======================================
    // BULLET LISTS
    // ======================================

    safeText =
        safeText.replace(
            /^[\-\*] (.*)$/gm,
            "<li>$1</li>"
        );


    // Group bullet items
    safeText =
        safeText.replace(
            /(<li>.*<\/li>\n?)+/g,

            function (match) {

                return `<ul>${match}</ul>`;

            }
        );


    // ======================================
    // NUMBERED LISTS
    // ======================================

    safeText =
        safeText.replace(
            /^\d+\. (.*)$/gm,
            "<li>$1</li>"
        );


    // ======================================
    // LINKS
    // ======================================

    safeText =
        safeText.replace(
            /(https?:\/\/[^\s<]+)/g,

            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );


    // ======================================
    // LINE BREAKS
    // ======================================

    safeText =
        safeText.replace(
            /\n/g,
            "<br>"
        );


    // ======================================
    // RESTORE CODE BLOCKS
    // ======================================

    codeBlocks.forEach(
        function (block, index) {

            const escapedCode =
                block.code
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");


            const codeHTML = `

                <div class="code-wrapper">

                    <div class="code-header">

                        <span class="code-language">
                            ${block.language}
                        </span>

                        <button
                            class="copy-code-btn"
                            type="button"
                        >
                            📋 Copy
                        </button>

                    </div>

                    <pre><code>${escapedCode}</code></pre>

                </div>

            `;


            safeText =
                safeText.replace(
                    `___CODE_BLOCK_${index}___`,
                    codeHTML
                );

        }
    );


    return safeText;
}


// ==========================================
// COPY CODE BUTTON
// ==========================================

function addCopyButtons(container) {

    const buttons =
        container.querySelectorAll(
            ".copy-code-btn"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",

                async function () {

                    const wrapper =
                        button.closest(
                            ".code-wrapper"
                        );


                    const code =
                        wrapper.querySelector(
                            "code"
                        );


                    try {

                        await navigator.clipboard.writeText(
                            code.textContent
                        );


                        button.textContent =
                            "✓ Copied";


                        setTimeout(
                            function () {

                                button.textContent =
                                    "📋 Copy";

                            },
                            1500
                        );


                    }

                    catch (error) {

                        console.error(
                            "Copy failed:",
                            error
                        );


                        button.textContent =
                            "Copy failed";

                    }

                }
            );

        }
    );
}


// ==========================================
// SHOW TYPING INDICATOR
// ==========================================

function showTyping() {

    // Prevent duplicate typing indicators
    if (
        document.getElementById(
            "typingIndicator"
        )
    ) {
        return;
    }


    const typing =
        document.createElement("div");


    typing.id =
        "typingIndicator";


    typing.className =
        "message bot-message";


    typing.innerHTML = `

        <div class="avatar bot-avatar">
            🤖
        </div>

        <div class="message-content">

            <div class="message-name">
                Gemini
            </div>

            <div class="message-text">

                <div class="typing">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        </div>

    `;


    chatBox.appendChild(typing);

    scrollToBottom();
}


// ==========================================
// HIDE TYPING INDICATOR
// ==========================================

function hideTyping() {

    const typing =
        document.getElementById(
            "typingIndicator"
        );


    if (typing) {

        typing.remove();

    }
}


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    const message =
        messageInput.value.trim();


    // Don't send empty messages
    if (!message) {

        return;

    }


    // ======================================
    // SHOW USER MESSAGE
    // ======================================

    addMessage(
        "user",
        message
    );


    // ======================================
    // CLEAR INPUT
    // ======================================

    messageInput.value = "";

    autoResize();


    // ======================================
    // DISABLE SEND BUTTON
    // ======================================

    sendBtn.disabled = true;


    // ======================================
    // SHOW TYPING
    // ======================================

    showTyping();


    try {

        console.log(
            "Sending message:",
            message
        );


        // ==================================
        // SEND TO YOUR NODE.JS SERVER
        // ==================================

        const response =
            await fetch(
                "/chat", {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
            );


        console.log(
            "Server status:",
            response.status
        );


        // ==================================
        // READ JSON RESPONSE
        // ==================================

        const data =
            await response.json();


        console.log(
            "Server response:",
            data
        );


        // Remove typing
        hideTyping();


        // ==================================
        // SERVER ERROR
        // ==================================

        if (!response.ok) {

            throw new Error(
                data.error ||
                `Server error: ${response.status}`
            );

        }


        // ==================================
        // CHECK GEMINI RESPONSE
        // ==================================

        if (!data.reply) {

            throw new Error(
                "Gemini returned an empty response."
            );

        }


        // ==================================
        // SHOW GEMINI RESPONSE
        // ==================================

        addMessage(
            "bot",
            data.reply
        );


    }

    catch (error) {

        console.error(
            "CHAT ERROR:",
            error
        );


        // Remove typing
        hideTyping();


        // ==================================
        // SHOW ERROR MESSAGE
        // ==================================

        const errorMessage =
            addMessage(
                "bot",

                `⚠️ **Gemini is not responding**

${error.message}

Please make sure your Node.js server is running on **localhost:5000**.`
            );


        const errorText =
            errorMessage.querySelector(
                ".message-text"
            );


        errorText.classList.add(
            "error-message"
        );

    }


    // ======================================
    // ENABLE SEND BUTTON
    // ======================================

    sendBtn.disabled = false;

    messageInput.focus();
}


// ==========================================
// ENTER TO SEND
// ==========================================

messageInput.addEventListener(
    "keydown",

    function (event) {

        /*
         * Enter = Send
         *
         * Shift + Enter = New line
         */

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ==========================================
// AUTO RESIZE INPUT
// ==========================================

messageInput.addEventListener(
    "input",
    autoResize
);


function autoResize() {

    messageInput.style.height =
        "auto";


    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            140
        ) + "px";
}


// ==========================================
// SEND BUTTON CLICK
// ==========================================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// ==========================================
// CLEAR CHAT
// ==========================================

clearBtn.addEventListener(
    "click",

    function () {

        // Remove all messages
        chatBox.innerHTML = `

            <div class="message bot-message">

                <div class="avatar bot-avatar">
                    🤖
                </div>

                <div class="message-content">

                    <div class="message-name">
                        Gemini
                    </div>

                    <div class="message-text">

                        Hello! 👋<br>

                        Chat cleared.
                        How can I help you?

                    </div>

                </div>

            </div>

        `;


        messageInput.value = "";

        autoResize();

        messageInput.focus();

    }
);


// ==========================================
// INITIALIZE
// ==========================================

messageInput.focus();

scrollToBottom();