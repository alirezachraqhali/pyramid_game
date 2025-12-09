let cards_freeze = null;
let game_cell = document.querySelector('#game #cell')
const cards = document.getElementById('cards')
const card_next = document.getElementById('card-next')
let card_selected = null
const MAX_NEXT_CARD = 4
let limit_next_card = 0
let enable_next_card = false
let cards_length = 0
function reloadGame(){
    if (game_cell.querySelectorAll('.row').length > 0)
        confirm('آیا میخواهید از اول بازی کنید ؟', start_game)
    else
        start_game()
}
function addEventForCardsUnlock(){
    cards_freeze = document.querySelectorAll('.card:not(.lock)')
    cards_freeze.forEach((card)=>{
        card.onclick = ()=>{
            if (card.classList.contains('lock') == false){
                if (card.getAttribute('number') == 'K'){
                    setHideCard(card)
                    removeCardIfCardsParent(card)
                } else {
                    selectCard(card)
                    cardValidate(card)
                }
                unlockMoreCards()
            }
        }
    })
}
function cardValidate(card) {
    if (card_selected){
        const validate = isValid(card_selected, card)
        if (validate == true) {
            setHideCard(card_selected)
            setHideCard(card)
            removeCardIfCardsParent(card_selected)
            removeCardIfCardsParent(card)
            deselectCards()

            setTimeout(()=> {
                reactStatusGame()
            }, 1000)
        } else if(validate == false) {
            alert('جمع عدد کارت های انتخاب شده 13 نیست.', true, deselectCards)
            //deselectCards()
        }
    }
}
function isValid(card_primary, card_secondery){
    if (card_primary && card_secondery){
        const n1 = card_primary.getAttribute('number')
        const n2 = card_secondery.getAttribute('number')
        const valids = [['Q','A'], ['J', '2'], ['10', '3'], ['9', '4'] , ['8', '5'], ['7', '6']]
        if (n1 != n2){
            let validate = false
            valids.forEach(v=> {
                if ((v[0] == n1 && v[1] == n2) ||
                    (v[0] == n2 && v[1] == n1))
                    validate = true
            })
            return validate
        }
    }
    return null
}
function removeCardIfCardsParent(card){
    if (card && card.classList.contains('card')){
        const parent = card.parentElement
        if (parent.classList.contains('cards')){
            setTimeout(()=> card.remove(), 500)
            if (cards_length >= 1){
                // if (parent.id = 'cards')
                //     parent.classList.add('empty')
                enable_next_card = true
            }
        }
        deselectCards()
    }
}
function reactStatusGame(){
    if (game_cell.querySelectorAll('.row .card:not(.lock):not(.hide)').length == 0){
        alert('شما برنده شدید !', false, ()=> reloadGame())
    } else {
        const _card = document.querySelectorAll('.card:not(.lock):not(.hide):not([number="K"])')
        let _continue = false
        _card.forEach(card=> {
            const ic1 = card.parentElement.classList.contains('cards')
            _card.forEach(c=> {
                const ic2 = c.parentElement.classList.contains('cards')
                if (!ic1 && !ic2 || ((ic1 && !ic2) || (!ic1 && ic2)))
                    if (isValid(card, c))
                        _continue = true
            })
        })
        if (_continue == false){
            alert('بازی به بن بست خورد !', false, ()=>reloadGame())
        }
    }
}
function selectCard(card){
    if (card_selected == null){
        card.classList.add('selected')
        card_selected = card
    } else
        if (card_selected == card)
            deselectCards()
}
function deselectCards(){
    if (card_selected != null){
        card_selected.classList.remove('selected')
        card_selected = null
    }
}
function unlockMoreCards(){
    const rows = game_cell.querySelectorAll('.row')
    for (i=0;i<rows.length;i++){
        const r1 = rows[i]
        const r2 = rows[i+1]
        if (r1 && r2){
            const ir1 = r1.querySelectorAll('.card')
            const ir2 = r2.querySelectorAll('.card')
            ir1.forEach((ii, n)=> {
                const ij = ir2[n]
                const ij2 = ir2[n+1]
                const is_bottom_hided = ij && ij.classList.contains('hide')
                const is_bottom_right_hided = ij2 && ij2.classList.contains('hide')
                if (is_bottom_hided && is_bottom_right_hided){
                    ii.classList.remove('lock')
                } else {
                    ii.classList.add('lock')
                }
            })
        }
    }
    addEventForCardsUnlock()
}
function start_game() {
    // تعریف خال‌ها و مقادیر کارت‌ها
    const suits =  ['0','1','2','3'] //['pick', 'del', 'khesht', 'khaj'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9','10', 'J', 'Q', 'K']
    // ساختن کل کارت‌ها
    let deck = [];
    for (let suit of suits)
        for (let value of values)
            deck.push(`${value} ${suit}`)
    // تابع شافل (Fisher-Yates Shuffle)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }
    // شافل کردن کارت‌ها
    let shuffledDeck = shuffle(deck)
    let j = 0, k = 0
    game_cell.innerHTML = ''
    for (i=1;i<=7;i++){
        const row = document.createElement('div')
        row.className = 'row'
        row.style.setProperty('--i', j)
        for(l=1; l<=i; l++){
            appendCard(shuffledDeck[k], row, false)
            k++;
        }
        game_cell.appendChild(row)
        j++;
    }
    for(m=shuffledDeck.length - 1; m>k; m--)
        appendCard(shuffledDeck[m], cards, false)

    cards.querySelectorAll('.card').forEach((card)=> {
        if (card == cards.lastChild)
            card.ondblclick = next_card
    })
    document.getElementById('btn-next-card').onclick = ()=> next_card()
    unlockMoreCards()
}
function appendCard(shuffle, parent, lock=false){
    if (shuffle){
        const sh = shuffle.split(' ')
        const num = sh[0]; const suit = sh[1]
        const card = document.createElement('div')
        card.className = `card ${lock? 'lock': ''}`
        card.setAttribute('number', num)
        card.setAttribute('suit', suit)
        parent.appendChild(card)
    }
}
function setHideCard(card) {
    if (card && card.classList.contains('card')){
        card.classList.add('hide')
    }
}
function next_card(){
    deselectCards()
    cards_length = cards.children.length
    if (cards_length > 0){  
        card_next.appendChild(cards.lastChild)
        enable_next_card = false
    }
    if (limit_next_card != MAX_NEXT_CARD){
        if (cards_length == 1){
            //cards.classList.add('empty')
            enable_next_card = true
        }
        if (cards_length == 0){
            const firstIndex = card_next.children.length -1
            for (i = firstIndex; i >= 0; i--){
                c = card_next.children.item(i)
                cards.appendChild(c)
            }
            limit_next_card++
            //cards.classList.remove('empty')
        }
    }
}
class ButtonDialog {
    constructor(title, enabled = true, style = null, onclick = ()=>{}){
        this.title = title ?? ''
        this.enabled = enabled
        this.style = style
        this.onclick = onclick
    }

    toHtmlElement(onClosingdialog){
        const btn = document.createElement('button')
        btn.textContent = this.title
        if (this.enabled === false)
            btn.disabled = false
        if (this.style != null)
            btn.style = style
        btn.onclick = ()=>{
            onClosingdialog()
            this.onclick()
        }
        return btn
    }
}
function createDialog(title, html, onClose = ()=>{}, buttons = []){
    let dialogs = document.querySelector('.dialogs')
    if (dialogs == null){
        dialogs = document.createElement('div')
        dialogs.classList.add('dialogs')
        document.body.appendChild(dialogs)
    }
    dialogs.onclick = ()=>{
        const d = dialogs.querySelectorAll('dialog .control-box')
        const last_dialog = d[d.length - 1]
        if (last_dialog){
            const class_name = 'pulse'
            last_dialog.classList.add(class_name)
            setTimeout(()=> last_dialog.classList.remove(class_name), parseFloat())
        }
    }
    const dialog = document.createElement('dialog')
    const control_box = document.createElement('div')
    control_box.classList.add('control-box')
    const funClose = ()=>{
        setTimeout(()=> {
            const parent = btn_close.parentElement.parentElement
            parent.close()
            //dialogs.innerHTML = ''
            dialogs.removeChild(parent)
            if (dialogs.children.length == 0)
                dialogs.remove()
            onClose()
        }, 50)
    }
    const btn_close = document.createElement('button')
    btn_close.classList.add('btn-close')
    btn_close.innerHTML = ''
    btn_close.onclick = funClose
    const _title = document.createElement('span')
    _title.classList.add('title')
    _title.textContent = title
    const content_box = document.createElement('p')
    content_box.classList.add('content-box')
    content_box.innerHTML = html
    const btns = document.createElement('div')
    btns.classList.add('buttons')
    buttons.forEach(btn=> {
        btns.appendChild(btn.toHtmlElement(funClose))
    })
    dialog.appendChild(control_box)
    control_box.appendChild(btn_close)
    control_box.appendChild(_title)
    dialog.appendChild(content_box)
    content_box.appendChild(btns)
    dialogs.appendChild(dialog)
    dialog.show()
}
function alert(message, alert_mode, onClosed = ()=>{}){
    createDialog('Alert', `<p><img src="assets/msg_${(alert_mode)?'warning':'information'}-0.png" alt=""><span>${message}</span></p>`, onClosed, [new ButtonDialog('OK !')])
}
function confirm(questation, onYes = ()=>{}, onNo = ()=>{}){
    const btns = []
    let isYes = false
    btns.push(new ButtonDialog('Yes', true, null, ()=>{isYes = true; onYes()}))
    btns.push(new ButtonDialog('No', true, null, ()=>{isYes = false; onNo()}))
    createDialog('Questation', `<p><img src="assets/msg_question-0.png" alt=""><span>${questation}</span></p>`, (isYes === true) ? onYes : onNo, btns)
}
function open_setting(){
    html = `تنظیمات به زودی در این بازی اضافه خواهد شد`
    createDialog('Game Setting', html)
}
//open_setting()
alert('سازنده : آقای علیرضا چراغعلئی', false, start_game)
//confirm('میخوای بازی کنی یا نه ؟', start_game)
//start_game()
//addEventForCardsUnlock()