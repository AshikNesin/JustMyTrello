function insertAfter(newNode, referenceNode) {
    if(isNaN(referenceNode.parentNode)){
    	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}

const getUserAvatarUrl = () =>{
	const userAvatarNode = document.querySelectorAll('.header-user .member-avatar')[0]
	const avatarUrl = userAvatarNode.getAttribute('src')
	return avatarUrl;
}
const toggleCardFilter = () =>{
	const filterBtn = document.getElementById('card-filter-btn')
	const filter = filterBtn.getAttribute('data-card-filter')
	if(filter==='all'){
		showMyCards()
	}
	else if(filter==='my'){
		showAllCards()
	}
}
const showMyCards = () => {
	const allCards = document.getElementsByClassName('list-card')
	const memberAvatarUrl = getUserAvatarUrl()

	const filterBtn = document.getElementById('card-filter-btn')
	filterBtn.setAttribute('data-card-filter','my')

	const filterText = document.getElementById('card-filter-text')
	filterText.innerHTML='My Cards'

	Array.from(allCards)
		.map((card)=>{
			let assignedToMember = false;
			const members = card.querySelectorAll('.list-card-members .member img')
			Array.from(members).map((member)=>{
				const imgUrl = member.getAttribute('src')
				assignedToMember = assignedToMember || imgUrl === memberAvatarUrl
			})
			if(!assignedToMember){
				card.classList.add('smc-is-hidden')
			}
		})
	return allCards
}

const showAllCards = () => {
	const allCards = document.getElementsByClassName('list-card')
	const filterBtn = document.getElementById('card-filter-btn')
	filterBtn.setAttribute('data-card-filter','all')

	const filterText = document.getElementById('card-filter-text')
	filterText.innerHTML='All Cards'

	Array.from(allCards)
		.map((card)=>{
					card.classList.remove('smc-is-hidden')
		})
	return allCards
}


const appendFilterButton = ()=> {
	const filterBtn = document.getElementById('card-filter-btn')
	if(filterBtn){
		return
	}

	const filterNode = document.createElement("a")
	filterNode.setAttribute('class','board-header-btn')
	filterNode.setAttribute('id','card-filter-btn')
	filterNode.setAttribute('data-card-filter','all')

	const iconNode = document.createElement("img")
	iconNode.setAttribute('class','board-header-btn-icon icon-sm')
	iconNode.setAttribute('src',  chrome.extension.getURL('/icons/filter-32.png'))

	const spanTextNode = document.createElement("span")
	spanTextNode.setAttribute('class','board-header-btn-text')
	spanTextNode.setAttribute('id','card-filter-text')
	spanTextNode.innerHTML = 'All Cards'

	filterNode.appendChild(iconNode)
	filterNode.appendChild(spanTextNode)

	filterNode.addEventListener('click', toggleCardFilter, true)

	const permissionLevelNode = document.getElementById('permission-level')

	insertAfter(filterNode,permissionLevelNode)
}

const initFilter = ()=>{
	const TRELLO_BOARD_REGEX = /(?:(?:http|https):\/\/)?(?:www.)?trello.com\/b\/\/?/

	setInterval(()=>{
		if(TRELLO_BOARD_REGEX.test(window.location.href)){
			appendFilterButton()
		}
	}, 1500)
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		initFilter()
	}
	}, 10);
});