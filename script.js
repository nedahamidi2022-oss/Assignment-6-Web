let partyData = [
    {
        floor: 2,
        name: "Balcony",
        guests: [
            { name: "Aigerim", color: "blue", time: "20:45", aitu: true, items: ["phone", "cup"] },
            { name: "Aliya", color: "yellow", time: "21:15", aitu: true, items: ["phone", "glasses", "bag"] },
            { name: "Madina", color: "green", time: "22:10", aitu: false, items: ["phone", "bag"] },
            { name: "Ivan", color: "purple", time: "20:10", aitu: true, items: ["cup"] }
        ]
    },
    {
        floor: 2,
        name: "Hall",
        guests: [
            { name: "Arman", color: "blue", time: "20:35", aitu: true, items: ["bag", "glasses"] },
            { name: "Sophia", color: "purple", time: "21:20", aitu: false, items: ["phone"] },
            { name: "Dias", color: "green", time: "19:45", aitu: true, items: [] },
            { name: "Bekzat", color: "red", time: "20:55", aitu: true, items: ["bag", "glasses", "cup"] },
            { name: "Aruzhan", color: "blue", time: "21:50", aitu: false, items: ["phone"] },
            { name: "Saule", color: "yellow", time: "21:25", aitu: true, items: ["glasses"] }
        ]
    },
    {
        floor: 1,
        name: "Kitchen",
        guests: [
            { name: "Nurlan", color: "red", time: "19:40", aitu: true, items: ["phone", "bag"] },
            { name: "Emma", color: "purple", time: "20:15", aitu: true, items: ["phone", "bag", "crumbs"] },
            { name: "Timur", color: "green", time: "21:05", aitu: true, items: ["phone", "bag"] },
            { name: "Sergey", color: "yellow", time: "20:50", aitu: true, items: ["glasses"] },
            { name: "Yerlan", color: "blue", time: "21:40", aitu: false, items: ["glasses", "phone"] },
            { name: "Kamila", color: "green", time: "20:05", aitu: true, items: [] }
        ]
    },
    {
        floor: 1,
        name: "Living room",
        guests: [
            { name: "Daniel", color: "blue", time: "19:55", aitu: true, items: ["glasses"] },
            { name: "Zarina", color: "purple", time: "22:30", aitu: true, items: ["bag", "phone"] },
            { name: "Natasha", color: "red", time: "20:30", aitu: true, items: ["bag", "crumbs"] },
            { name: "Askar", color: "yellow", time: "21:00", aitu: true, items: ["phone"] },
            { name: "Inkar", color: "green", time: "20:20", aitu: true, items: ["bag"] }
        ]
    }
];

const colorMap = {
    blue: "#007bff",
    yellow: "#ffc107",
    green: "#28a745",
    purple: "#6f42c1",
    red: "#dc3545"
};

const itemIcons = {
    phone: "📱",
    glasses: "👓",
    bag: "👜",
    cup: "☕",
    crumbs: "🍪"
};

let activeModalGuest = null;

function renderPage() {
    let houseHtml = "";
    let floors = [2, 1];
    
    floors.forEach(f => {
        houseHtml += `<div class="floor">`;
        partyData.filter(r => r.floor === f).forEach(room => {
            houseHtml += `<div class="room" data-room="${room.name}">
                <div class="room-header">
                    <h3>${room.name} (Floor ${room.floor})</h3>
                    <button class="sort-btn">Sort by time</button>
                </div>
                <div class="guest-list">`;
            
            room.guests.forEach(g => {
                let iconsStr = g.items.map(i => itemIcons[i] || "").join("");
                houseHtml += `<div class="guest-card" 
                    data-name="${g.name}" 
                    data-color="${g.color}" 
                    data-time="${g.time}" 
                    data-aitu="${g.aitu}" 
                    data-items="${g.items.join(',')}"
                    data-room="${room.name}">
                    <div class="avatar-container">
                        <img class="avatar-img" src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${g.name}" alt="${g.name}">
                        <div class="color-ring" style="border-color: ${colorMap[g.color]};"></div>
                        ${g.aitu ? '<div class="badge">🎓</div>' : ''}
                    </div>
                    <div class="guest-name">${g.name}</div>
                    <div class="guest-time">${g.time}</div>
                    <div class="icons">${iconsStr}</div>
                </div>`;
            });

            houseHtml += `</div></div>`;
        });
        houseHtml += `</div>`;
    });

    $("#house").html(houseHtml);
}

const cases = [
    "1. Hall guests",
    "2. Yellow or Purple",
    "3. AITU upstairs",
    "4. Glasses or Bag",
    "5. Came with nothing",
    "6. Phone no bag",
    "7. Time 20:30-21:00",
    "8. After 21:00 non-AITU",
    "9. Next to Askar",
    "10. Last in each room",
    "11. Third in each room",
    "12. After Timur",
    "13. Before someone black/purple",
    "14. Room of Aruzhan",
    "15. Rooms < 6 guests",
    "16. Cup & no glasses",
    "17. First in each room",
    "18. Miras joins",
    "19. Natasha leaves",
    "20. The Thief"
];

function renderCases() {
    let html = "";
    cases.forEach((c, index) => {
        html += `<button class="case-btn" data-case="${index + 1}">${c}</button>`;
    });
    $("#cases-container").html(html);
}

function executeCase(caseNum) {
    if (caseNum !== 18 && caseNum !== 19) {
        renderPage();
    }
    
    let $target;
    
    switch(caseNum) {
        case 1:
            $target = $(".room[data-room='Hall'] .guest-card");
            break;
        case 2:
            $target = $(".guest-card").filter((i, el) => {
                let c = $(el).data("color");
                return c === "yellow" || c === "purple";
            });
            break;
        case 3:
            $target = $(".floor").first().find(".guest-card").filter((i, el) => $(el).data("aitu") === true);
            break;
        case 4:
            $target = $(".guest-card").filter((i, el) => {
                let items = $(el).data("items").split(",");
                return items.includes("glasses") || items.includes("bag");
            });
            break;
        case 5:
            $target = $(".guest-card").filter((i, el) => $(el).data("items") === "");
            break;
        case 6:
            $target = $(".guest-card").filter((i, el) => {
                let items = $(el).data("items").split(",");
                return items.includes("phone") && !items.includes("bag");
            });
            break;
        case 7:
            $target = $(".guest-card").filter((i, el) => {
                let t = $(el).data("time");
                return t >= "20:30" && t <= "21:00";
            });
            break;
        case 8:
            $target = $(".guest-card").filter((i, el) => {
                let t = $(el).data("time");
                let aitu = $(el).data("aitu");
                return t > "21:00" && aitu === false;
            });
            break;
        case 9:
            $target = $(".guest-card[data-name='Askar']").prev().add($(".guest-card[data-name='Askar']").next());
            break;
        case 10:
            $target = $(".room").map((i, r) => $(r).find(".guest-card").last().get());
            break;
        case 11:
            $target = $(".room").map((i, r) => $(r).find(".guest-card").eq(2).get());
            break;
        case 12:
            $target = $(".guest-card[data-name='Timur']").nextAll();
            break;
        case 13:
            $target = $(".guest-card").filter((i, el) => $(el).next().data("color") === "black" || $(el).next().find(".color-ring").css("border-color") === "rgb(0, 0, 0)");
            break;
        case 14:
            $target = $(".guest-card[data-name='Aruzhan']").closest(".room");
            break;
        case 15:
            $target = $(".room").filter((i, r) => $(r).find(".guest-card").length < 6);
            break;
        case 16:
            $target = $(".room").filter((i, r) => {
                let hasCup = $(r).find(".guest-card").filter((idx, el) => $(el).data("items").includes("cup")).length > 0;
                let hasGlasses = $(r).find(".guest-card").filter((idx, el) => $(el).data("items").includes("glasses")).length > 0;
                return hasCup && !hasGlasses;
            });
            break;
        case 17:
            $target = $(".room").map((i, r) => $(r).find(".guest-card").first().get());
            break;
        case 18:
            let $askar = $(".guest-card[data-name='Askar']");
            let newCard = `<div class="guest-card" data-name="Miras" data-color="blue" data-time="21:20" data-aitu="true" data-items="phone" style="display:none;">
                <div class="avatar-container">
                    <img class="avatar-img" src="https://api.dicebear.com/9.x/open-peeps/svg?seed=Miras" alt="Miras">
                    <div class="color-ring" style="border-color: ${colorMap["blue"]};"></div>
                    <div class="badge">🎓</div>
                </div>
                <div class="guest-name">Miras</div>
                <div class="guest-time">21:20</div>
                <div class="icons">📱</div>
            </div>`;
            $(newCard).insertBefore($askar).fadeIn(1000);
            $target = $(".guest-card[data-name='Miras']");
            break;
        case 19:
            $target = $(".guest-card[data-name='Natasha']");
            $target.fadeOut(1000, function() { $(this).remove(); });
            break;
        case 20:
            $target = $(".guest-card[data-name='Natasha']");
            break;
    }

    applySpotlight($target);

    if ($target && $target.length > 0) {
        $target.stop(true, true).animate({top: "-10px"}, 200).animate({top: "0px"}, 200);
    }
}

function applySpotlight($target) {
    $(".guest-card, .room").stop(true, true).fadeTo(300, 0.2).removeClass("highlighted");
    
    if ($target.hasClass("room")) {
        $target.find(".guest-card").stop(true, true).fadeTo(300, 1.0).addClass("highlighted");
    } else {
        $target.stop(true, true).fadeTo(300, 1.0).addClass("highlighted");
    }
}

$(document).ready(function() {
    renderPage();
    renderCases();

    $(document).on("click", ".case-btn", function() {
        let caseNum = $(this).data("case");
        executeCase(caseNum);
    });

    $("#clear-btn").click(function() {
        $(".guest-card, .room").stop(true, true).fadeTo(300, 1.0).removeClass("highlighted");
    });

    $(document).on("click", ".guest-card", function(e) {
        e.stopPropagation();
        let name = $(this).data("name");
        let time = $(this).data("time");
        let aitu = $(this).data("aitu") === true;
        let items = $(this).data("items") ? $(this).data("items").split(",") : [];
        
        activeModalGuest = $(this);
        
        let detailsHtml = `<h4>${name}</h4>
            <p>Came at ${time}</p>
            <p>${aitu ? "AITU student" : "Not an AITU student"}</p>
            <p>Items: ${items.length > 0 ? items.join(", ") : "Nothing"}</p>`;
        
        let moveHtml = "";
        partyData.forEach(r => {
            if (r.name !== $(this).data("room")) {
                moveHtml += `<button class="move-room-btn" data-room="${r.name}">Move to ${r.name}</button><br>`;
            }
        });

        $("#modal-details").html(detailsHtml);
        $("#move-buttons").html(moveHtml);
        $("#card-modal").fadeIn(200);
    });

    $("#close-modal").click(function() {
        $("#card-modal").fadeOut(200);
    });

    $(document).keydown(function(e) {
        if (e.key === "Escape") {
            $("#card-modal").fadeOut(200);
        }
    });

    $(document).on("click", ".move-room-btn", function() {
        if (!activeModalGuest) return;
        let targetRoomName = $(this).data("room");
        let $targetRoomList = $(`.room[data-room='${targetRoomName}'] .guest-list`);
        
        let $cardClone = activeModalGuest.clone();
        activeModalGuest.fadeOut(300, function() {
            $(this).remove();
        });
        
        $cardClone.hide().appendTo($targetRoomList).fadeIn(300);
        $cardClone.attr("data-room", targetRoomName);
        
        $("#card-modal").fadeOut(200);
    });

    $(document).on("click", ".sort-btn", function() {
        let $room = $(this).closest(".room");
        let $list = $room.find(".guest-list");
        let $cards = $list.find(".guest-card");
        
        let isSorted = $room.data("sorted") === true;
        
        if (!isSorted) {
            let sortedCards = $cards.toArray().sort((a, b) => {
                let timeA = $(a).data("time");
                let timeB = $(b).data("time");
                return timeA.localeCompare(timeB);
            });
            $list.stop(true, true).fadeOut(200, function() {
                $list.html(sortedCards).fadeIn(200);
            });
            $room.data("sorted", true);
            $(this).text("Unsort");
        } else {
            renderPage();
            $room.data("sorted", false);
            $(this).text("Sort by time");
        }
    });
});