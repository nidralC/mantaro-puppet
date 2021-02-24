const {
    remote, globalShortcut
} = require('electron');
const puppeteer = require('puppeteer-core');

const minimizeWindow = () => {
    var window = remote.getCurrentWindow();
    window.minimize();
}

const closeWindow = () => {
    var window = remote.getCurrentWindow();
    window.close();
}

document.querySelector('.progress').style.visibility = 'hidden';

const changeProgressText = text => {
    document.querySelector('.progressText').innerHTML = text;
}

const emailInput = document.querySelector('input[name=email]');
const pwdInput = document.querySelector('input[name=pwd]');
const serverInput = document.querySelector('input[name=serverId]');
const channelInput = document.querySelector('input[name=channelId]');

if (localStorage.getItem("email") != null) {
    emailInput.value = localStorage.getItem("email")
}

if (localStorage.getItem("pwd") != null) {
    pwdInput.value = localStorage.getItem("pwd")
}

if (localStorage.getItem("serverId") != null) {
    serverInput.value = localStorage.getItem("serverId")
}

if (localStorage.getItem("channelId") != null) {
    channelInput.value = localStorage.getItem("channelId")
}

emailInput.addEventListener('change', () => {
    localStorage.setItem("email", emailInput.value);
})

pwdInput.addEventListener('change', () => {
    localStorage.setItem("pwd", pwdInput.value);
})

serverInput.addEventListener('change', () => {
    localStorage.setItem("serverId", serverInput.value);
})

channelInput.addEventListener('change', () => {
    localStorage.setItem("channelId", channelInput.value);
})

const startMantaroPuppet = async (e) => {
    e.preventDefault();

    document.querySelector('.progress').style.visibility = 'visible';
    
    const linuxExecutable = "google-chrome";
    const winExecutable = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

    const currExecutable = process.platform === 'win32' ? winExecutable : linuxExecutable;

    const browser = await puppeteer.launch({executablePath: currExecutable,
        headless: true});
    
    let loginPage = await browser.newPage()
    let commandsPage;

    document.querySelector('.btnStop').addEventListener('click', function () {
        document.querySelector('.progress').style.visibility = 'hidden';
        remote.getCurrentWindow().reload();
    });

    // Runtime variables.
    const loopTimer = 300000; // in ms
    const runsMax = 288;
    
    const user = {
        email: document.querySelector('input[name=email]').value,
        password: document.querySelector('input[name=pwd]').value
    }

    const serverId = document.querySelector('input[name=serverId]').value
    const channelId = document.querySelector('input[name=channelId]').value
    
    let run = 1;
    const login = async () => {
        changeProgressText("Authorizing user...\n")
        let logged = false
    
        await loginPage.goto('https://discord.com/login')
    
        const emailInput = await loginPage.$('input[name="email"]')
        const pwdInput = await loginPage.$('input[name="password"]')
        const loginBtn = await loginPage.$('button[type="submit"]')
    
        await emailInput.type(user.email)
        await pwdInput.type(user.password)
        await loginBtn.click()
    
        loginPage.on('response', async () => {
            if (logged == false && loginPage.url() == 'https://discord.com/channels/@me') {
                logged = true
                sendCommands()
                loginPage.close();
            }
        })
        return
    }

    const sendMessage = async (msg) => {
        await commandsPage.keyboard.type(msg)
        await commandsPage.keyboard.press('Enter')
        await commandsPage.waitForTimeout(2000);
    }
    
    const sendCommands = async () => {
        changeProgressText('Loading chat...\n');
    
        commandsPage = await browser.newPage()
        await commandsPage.goto(`https://discord.com/channels/${serverId}/${channelId}`)
    
        await commandsPage.waitForSelector('form', {
            visible: true,
        })
    
        changeProgressText('Sending commands...\n');
    
        await commandsPage.waitForTimeout(2000);
    
        await sendMessage('Mantaro mine');
        await sendMessage('Mantaro fish');
        await sendMessage('Mantaro chop');
        await sendMessage('Mantaro loot');
        await sendMessage('Mantaro trivia');
        await sendMessage('2');
        await sendMessage('1');
    
        if (run == 1) {
            await sendMessage('Mantaro daily');
        } else if (run == runsMax) {
            run = 0;
        }
    
        let seconds = 0
        let loop = setInterval(async () => {
            changeProgressText('Waiting ' + ((loopTimer / 1000) - seconds) + ' seconds cooldown\n');
            seconds += 1
        }, 1000)
    
        await commandsPage.waitForTimeout(loopTimer)
    
        clearInterval(loop)

        run++
    
        sendCommands();
    
        return
    }
    
    await login()

};

document.querySelector('.btnMin').addEventListener('click', minimizeWindow)
document.querySelector('.btnClose').addEventListener('click', closeWindow)
document.querySelector('.form').addEventListener('submit', startMantaroPuppet)