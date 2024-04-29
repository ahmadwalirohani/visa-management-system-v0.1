function closePrint() {
    document.body.removeChild(this.__container__);
}

export default async function Printer(curl, Data) {
    const iframe = document.createElement("iframe");
    iframe.onload = function () {
        this.contentWindow.__container__ = this;
        for (const key in Data) {
            if (Object.hasOwnProperty.call(Data, key)) {
                this.contentWindow.document.getElementById(key).innerHTML =
                    typeof Data[key] == "function" ? Data[key]() : Data[key];
            }
        }
        this.contentWindow.onbeforeunload = closePrint;
        this.contentWindow.onafterprint = closePrint;
        this.contentWindow.focus();
        this.contentWindow.print();
    };
    iframe.style.position = "fixed";
    iframe.style.bottom = "0";
    iframe.style.right = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = curl;
    document.body.appendChild(iframe);
}
