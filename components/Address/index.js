const template = `
<style>
    :host {
    }
    .address{
        display: flex;
        flex-direction: column;
        gap:0.5em;
    }
    .address h4{
        margin:0;
    }
    .address .content {
        display: flex;
        gap:0.5em;
    }
    .address .value{
        padding:0.5em;
        border-radius:0.5em;
        background-color:rgba(255,255,255,.2);
    }
    .address .btn{
        display:flex;
        align-items:center;
        cursor: pointer;
        padding: 0.2em 0.5em;
        border-radius: 0.5em;
        border: 1px solid #fff;
        color: #fff;
        text-align: center;
        transition: background-color 0.3s ease;
    }
    @media screen and (max-width:480px){
        .address .content{
            flex-direction:column;
            align-items:flex-start;
        }
        .address .value{
            font-size:3vw;
        }
    }
</style>
<div class="address">
    <h4>Token Address:</h4>
    <div class="content">
        <div class="value"></div>
        <div class="btn">Copy</div>
    </div>
</div>
`;
class Address extends HTMLElement {
    static get observedAttributes() {
        return ["value"];
    }
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const $template = document.createElement("template");
        $template.innerHTML = template;
        this.shadowRoot.appendChild($template.content.cloneNode(true));
        this.$value = this.shadowRoot.querySelector(".value");
        this.$btn = this.shadowRoot.querySelector(".btn");
        this._onCopy = this._onCopy.bind(this);
    }

    connectedCallback() {
        this._render();
        this.$btn.addEventListener("click", this._onCopy);
    }

    disconnectedCallback() {
        this.$btn.removeEventListener("click", this._onCopy);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "value" && oldValue !== newValue) {
            this._render();
        }
    }

    _render() {
        this.$value.textContent =
            this.getAttribute("value") ||
            "0x00000000000000000000000000000000000000";
    }

    _onCopy() {
        navigator.clipboard
            .writeText(this.$value.textContent)
            .then(() => {
                const originText = this.$btn.textContent;
                this.$btn.textContent = "Copied!";
                setTimeout(() => {
                    this.$btn.textContent = originText;
                }, 3000);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    }
}
window.customElements.define("x-address", Address);
