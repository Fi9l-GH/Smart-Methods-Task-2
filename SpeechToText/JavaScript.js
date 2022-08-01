var speechRecognition =window.webkitSpeechRecognition
var recognition = new speechRecognition()
var textbox = $("#textbox")
var instructions = $("#instructions")
var content = ''
var lang = document.getElementById("lang-select")
let isConnectted = false;
let port;
let writer;
const enc = new TextEncoder();

async function onChangespeech() {
    if (!isConnectted) {
        alert("No Arduino connected");
        return;
    }

    try {
        const commandlist = content;
        const commandSplit = commandlist.split(" ")
        const command = commandSplit.slice(-1);
        const computerText = `${command}@`;
        await writer.write(enc.encode(computerText));
    } catch (e) {
        console.log(e);
    }
}


async function onConnectUsb() {
    try {
        const requestOptions = {
            // Filter on devices with the Arduino USB vendor ID.
            filters: [{usbVendorId: 0x2341}],
        };

        // Request an Arduino from the user.
        port = await navigator.serial.requestPort(requestOptions);
        await port.open({baudRate: 9600});
        writer = port.writable.getWriter();
        isConnectted = true;
    } catch (e) {
        console.log("error", e);
    }
}

$("#start-btn").click(function (event){

    recognition.lang = lang.value

    if (content.length){
        content += ''
    }
    recognition.start()
})

recognition.onstart = function(){
    instructions.text("Program Is Running")
}

recognition.onspeechend = function(){
    instructions.text("Press The Start Button To Run The Program Again")
}

recognition.onresult = function(event){

    var current = event.resultIndex
    var transcript = event.results[current][0].transcript
    content = transcript
    onChangespeech()
    textbox.val(content)
}

recognition.onerror = function(){
    instructions.text("ERROR")
}

textbox.on('input', function(){
    content = $(this).val()
})