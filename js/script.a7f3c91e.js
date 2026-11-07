  const gameConfigs = {
            6: { village: 3, wolf: 2, neutral: 1 },
            7: { village: 4, wolf: 2, neutral: 1 },
            8: { village: 4, wolf: 3, neutral: 1 },
            9: { village: 5, wolf: 3, neutral: 1 },
            10: { village: 5, wolf: 3, neutral: 2 },
            11: { village: 6, wolf: 3, neutral: 2 },
            12: { village: 6, wolf: 4, neutral: 2 },
            13: { village: 7, wolf: 4, neutral: 2 },
            14: { village: 7, wolf: 4, neutral: 3 },
            15: { village: 8, wolf: 4, neutral: 3 }
        };

        const rolePools = {
            village: ["Tiên tri 🔮", "Thợ săn 🏹", "Phù thủy 🧪", "Bảo vệ 🛡️", "Điều tra viên 🔍", "Trưởng làng 👑", "Dân thường 🧑‍🌾", "Dân thường 🧑‍🌾", "Dân thường 🧑‍🌾", "Dân thường 🧑‍🌾", "Dân thường 🧑‍🌾"],
            wolf: ["Sói thường 🐺", "Sói thường 🐺", "Sói chúa 👑", "Sói phù thủy 🔮", "Sói sát thủ 🗡️", "Sói đầu đàn 🐺"],
            neutral: ["Kẻ ngốc 🃏", "Kẻ sống sót 🛡️", "Sát nhân 🔪", "Ma cà rồng 🦇", "Cupid 🏹", "Kẻ nguyền rủa ⚡"]
        };

        const defaultMembers = [
            "Nguyễn Tuấn Anh",
            "Nguyễn Hương Giang",
            "Đỗ Hữu Tuân",
            "Chu Thị Lan Anh",
            "Nguyễn Văn Đạt",
            "Phan Lạc Quốc Anh"
        ];

        const roleDetails = {
            "Tiên tri 🔮": { faction: "Phe Dân Làng", color: "from-emerald-700 to-sageDark", desc: "Mỗi đêm kiểm tra một người chơi có thuộc phe Sói hay không để bảo vệ làng.", win: "Điều kiện thắng: Tiêu diệt toàn bộ Ma Sói." },
            "Thợ săn 🏹": { faction: "Phe Dân Làng", color: "from-emerald-700 to-sageDark", desc: "Khi chết được quyền bắn kéo theo một người chơi bất kỳ đi cùng.", win: "Điều kiện thắng: Tiêu diệt toàn bộ Ma Sói." },
            "Dân thường 🧑‍🌾": { faction: "Phe Dân Làng", color: "from-emerald-700 to-sageDark", desc: "Không có kỹ năng đặc biệt. Vũ khí duy nhất là sự tỉnh táo và kỹ năng biện minh.", win: "Điều kiện thắng: Tiêu diệt toàn bộ Ma Sói." },
            "Phù thủy 🧪": { faction: "Phe Dân Làng", color: "from-emerald-700 to-sageDark", desc: "Có 1 bình cứu và 1 bình độc, mỗi loại dùng 1 lần duy nhất trong ván đấu.", win: "Điều kiện thắng: Tiêu diệt toàn bộ Ma Sói." },
            "Bảo vệ 🛡️": { faction: "Phe Dân Làng", color: "from-emerald-700 to-sageDark", desc: "Mỗi đêm bảo vệ một người khỏi Sói cắn (không được bảo vệ 2 đêm liên tiếp 1 người).", win: "Điều kiện thắng: Tiêu diệt toàn bộ Ma Sói." },
            "Điều tra viên 🔍": { faction: "Phe Dân Làng", color: "from-emerald-700 to-sageDark", desc: "Mỗi đêm kiểm tra xem hai người chơi có cùng phe với nhau hay không.", win: "Điều kiện thắng: Tiêu diệt toàn bộ Ma Sói." },
            "Trưởng làng 👑": { faction: "Phe Dân Làng", color: "from-emerald-700 to-sageDark", desc: "Có 2 mạng khi bị Sói cắn lần đầu; nhưng nếu bị treo cổ ban ngày thì vẫn chết.", win: "Điều kiện thắng: Tiêu diệt toàn bộ Ma Sói." },
            "Sói thường 🐺": { faction: "Phe Ma Sói", color: "from-rose-700 to-rose-900", desc: "Cùng bầy Sói chọn một nạn nhân để ăn thịt vào mỗi đêm. Ngụy trang ban ngày.", win: "Điều kiện thắng: Số Sói >= Tổng số người phe đối địch còn sống." },
            "Sói chúa 👑": { faction: "Phe Ma Sói", color: "from-rose-700 to-rose-900", desc: "Có quyền chọn một lần biến nạn nhân bị cắn thành Sói thay vì giết chết họ.", win: "Điều kiện thắng: Số Sói >= Tổng số người phe đối địch còn sống." },
            "Sói phù thủy 🔮": { faction: "Phe Ma Sói", color: "from-rose-700 to-rose-900", desc: "Một lần trong đêm có thể khóa kỹ năng đặc biệt của một người chơi.", win: "Điều kiện thắng: Số Sói >= Tổng số người phe đối địch còn sống." },
            "Sói sát thủ 🗡️": { faction: "Phe Ma Sói", color: "from-rose-700 to-rose-900", desc: "Một lần trong game được quyền tiêu diệt thêm một nạn nhân độc lập.", win: "Điều kiện thắng: Số Sói >= Tổng số người phe đối địch còn sống." },
            "Sói đầu đàn 🐺": { faction: "Phe Ma Sói", color: "from-rose-700 to-rose-900", desc: "Nếu còn sống, phiếu chọn mục tiêu của Sói có quyền ưu tiên khi hòa phiếu.", win: "Điều kiện thắng: Số Sói >= Tổng số người phe đối địch còn sống." },
            "Kẻ ngốc 🃏": { faction: "Phe Trung Lập", color: "from-amber-600 to-darkOrange", desc: "Gây rối hoặc giả sói để bị dân làng treo cổ ban ngày.", win: "Điều kiện thắng: Thắng ngay lập tức khi bị dân làng treo cổ." },
            "Kẻ sống sót 🛡️": { faction: "Phe Trung Lập", color: "from-amber-600 to-darkOrange", desc: "Sở hữu kỹ năng sinh tồn, mục tiêu duy nhất là sống sót qua mọi đêm.", win: "Điều kiện thắng: Sống sót đến khi ván đấu kết thúc." },
            "Sát nhân 🔪": { faction: "Phe Trung Lập", color: "from-amber-600 to-darkOrange", desc: "Sát thủ độc lập, mỗi đêm ra tay giết một người.", win: "Điều kiện thắng: Trở thành người sống sót cuối cùng." },
            "Ma cà rồng 🦇": { faction: "Phe Trung Lập", color: "from-amber-600 to-darkOrange", desc: "Mỗi đêm cắn người, xây dựng lực lượng ngầm độc lập.", win: "Điều kiện thắng: Phe Vampire chiếm ưu thế kiểm soát." },
            "Cupid 🏹": { faction: "Phe Trung Lập", color: "from-amber-600 to-darkOrange", desc: "Ghép đôi hai người chơi đầu game thành tình nhân sinh tử.", win: "Điều kiện thắng: Thắng cùng người yêu nếu họ sống đến cuối." },
            "Kẻ nguyền rủa ⚡": { faction: "Phe Trung Lập", color: "from-amber-600 to-darkOrange", desc: "Nguyền người khác, thắng khi hoàn thành 3 lần nguyền khiến mục tiêu chết.", win: "Điều kiện thắng: Hoàn thành 3 lời nguyền." }
        };

        let currentSelectedCount = 6;
        let customVillage = 3;
        let customWolf = 2;
        let customNeutral = 1;

        let currentPlayers = [];
        let assignedGameData = []; 
        let currentPlayerIndex = 0;
        let isCardFlipped = false;

        function initSetup() {
            const countContainer = document.getElementById("playerCountButtons");
            countContainer.innerHTML = "";
            for (let i = 6; i <= 15; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;
                btn.className = `py-2 rounded-xl text-xs font-bold transition shadow-sm ${i === currentSelectedCount ? 'bg-gradient-to-r from-softOrange to-darkOrange text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-lightOrange/50'}`;
                btn.onclick = () => setPlayerCount(i);
                countContainer.appendChild(btn);
            }
            
            const def = gameConfigs[currentSelectedCount];
            customVillage = def.village;
            customWolf = def.wolf;
            customNeutral = def.neutral;

            updateFactionDisplay();
            updateConfigDisplay();
        }

        function setPlayerCount(count) {
            currentSelectedCount = count;
            const def = gameConfigs[count];
            customVillage = def.village;
            customWolf = def.wolf;
            customNeutral = def.neutral;
            initSetup();
        }

        function adjustFaction(faction, delta) {
            if (faction === 'village') {
                if (customVillage + delta >= 1 && (customVillage + delta + customWolf + customNeutral <= currentSelectedCount)) {
                    customVillage += delta;
                }
            } else if (faction === 'wolf') {
                if (customWolf + delta >= 1 && (customVillage + customWolf + delta + customNeutral <= currentSelectedCount)) {
                    customWolf += delta;
                }
            } else if (faction === 'neutral') {
                if (customNeutral + delta >= 0 && (customVillage + customWolf + customNeutral + delta <= currentSelectedCount)) {
                    customNeutral += delta;
                }
            }
            updateFactionDisplay();
        }

        function updateFactionDisplay() {
            document.getElementById("inputVillage").textContent = customVillage;
            document.getElementById("inputWolf").textContent = customWolf;
            document.getElementById("inputNeutral").textContent = customNeutral;

            const totalSum = customVillage + customWolf + customNeutral;
            const msg = document.getElementById("factionValidationMsg");
            if (totalSum === currentSelectedCount) {
                msg.textContent = "✓ Khớp tổng số người";
                msg.className = "text-[11px] font-semibold text-emerald-700";
            } else {
                msg.textContent = `⚠️ Tổng (${totalSum}/${currentSelectedCount}) chưa khớp!`;
                msg.className = "text-[11px] font-bold text-rose-600";
            }
        }

        function updateConfigDisplay() {
            document.getElementById("playerCountBadge").textContent = `${currentSelectedCount} Người`;

            const container = document.getElementById("playersNameContainer");
            container.innerHTML = "";
            for (let i = 0; i < currentSelectedCount; i++) {
                const defaultName = i < defaultMembers.length ? defaultMembers[i] : `Thành viên ${i + 1}`;
                const div = document.createElement("div");
                div.className = "flex items-center gap-2";
                div.innerHTML = `
                    <span class="w-6 h-6 rounded-full bg-lightOrange text-darkOrange flex items-center justify-center text-[10px] font-bold">${i + 1}</span>
                    <input type="text" id="playerName_${i}" value="${defaultName}" class="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-softOrange bg-warmBg font-medium text-gray-700">
                `;
                container.appendChild(div);
            }
        }

        function startDistribution() {
            const totalSum = customVillage + customWolf + customNeutral;
            if (totalSum !== currentSelectedCount) {
                showToast(`⚠️ Tổng số role (${totalSum}) phải bằng tổng số người chơi (${currentSelectedCount})!`);
                return;
            }

            currentPlayers = [];
            for (let i = 0; i < currentSelectedCount; i++) {
                const inputVal = document.getElementById(`playerName_${i}`).value.trim();
                currentPlayers.push(inputVal || `Thành viên ${i + 1}`);
            }

            // Chọn ngẫu nhiên roles theo số lượng tùy chỉnh
            let chosenRoles = [];
            
            // Lấy ngẫu nhiên village roles
            let vPool = [...rolePools.village].sort(() => Math.random() - 0.5);
            for(let i=0; i<customVillage; i++) {
                chosenRoles.push(vPool[i % vPool.length]);
            }

            // Lấy ngẫu nhiên wolf roles
            let wPool = [...rolePools.wolf].sort(() => Math.random() - 0.5);
            for(let i=0; i<customWolf; i++) {
                chosenRoles.push(wPool[i % wPool.length]);
            }

            // Lấy ngẫu nhiên neutral roles
            let nPool = [...rolePools.neutral].sort(() => Math.random() - 0.5);
            for(let i=0; i<customNeutral; i++) {
                chosenRoles.push(nPool[i % nPool.length]);
            }

            // Xáo trộn toàn bộ danh sách role vừa chọn cho các người chơi
            chosenRoles.sort(() => Math.random() - 0.5);

            assignedGameData = currentPlayers.map((name, idx) => ({
                name: name,
                role: chosenRoles[idx],
                viewed: false
            }));

            localStorage.setItem("coreSixMaSoiGame", JSON.stringify({
                count: currentSelectedCount,
                data: assignedGameData,
                active: true
            }));

            currentPlayerIndex = 0;
            showGameplayPanel();
        }

        function showGameplayPanel() {
            document.getElementById("configPanel").classList.add("hidden");
            document.getElementById("gameplayPanel").classList.remove("hidden");
            document.getElementById("gameplayPanel").classList.add("flex");
            loadPlayerTurn();
            buildModeratorList();
        }

        function loadPlayerTurn() {
            const player = assignedGameData[currentPlayerIndex];
            document.getElementById("currentTurnTitle").textContent = `Đến lượt: ${player.name}`;
            document.getElementById("cardPlayerName").textContent = player.name;

            const roleInfo = roleDetails[player.role] || { faction: "Phe Bí Mật", color: "from-sageDark to-darkOrange", desc: "Vai trò đặc biệt trong ván đấu.", win: "Cố gắng hoàn thành mục tiêu cá nhân." };
            document.getElementById("roleBadge").textContent = roleInfo.faction;
            document.getElementById("roleName").textContent = player.role;
            document.getElementById("roleDescription").textContent = roleInfo.desc;
            document.getElementById("factionCondition").textContent = roleInfo.win;

            isCardFlipped = false;
            document.getElementById("personalCardInner").classList.remove("is-flipped");

            document.getElementById("btnPrevPlayer").style.display = currentPlayerIndex === 0 ? "none" : "block";
            document.getElementById("btnNextPlayer").innerHTML = currentPlayerIndex === assignedGameData.length - 1 ? 
                `<span>Hoàn thành phát bài • Bắt đầu đêm đầu tiên</span> <i class="fa-solid fa-moon"></i>` : 
                `<span>Đã nhớ vai trò, chuyển người tiếp theo</span> <i class="fa-solid fa-arrow-right"></i>`;
        }

        function flipPersonalCard() {
            isCardFlipped = !isCardFlipped;
            const inner = document.getElementById("personalCardInner");
            if (isCardFlipped) {
                inner.classList.add("is-flipped");
                assignedGameData[currentPlayerIndex].viewed = true;
                localStorage.setItem("coreSixMaSoiGame", JSON.stringify({ count: currentSelectedCount, data: assignedGameData, active: true }));
                buildModeratorList();
            } else {
                inner.classList.remove("is-flipped");
            }
        }

        function nextPlayer() {
            if (currentPlayerIndex < assignedGameData.length - 1) {
                currentPlayerIndex++;
                loadPlayerTurn();
                showToast(`Đã chuyển sang lượt của ${assignedGameData[currentPlayerIndex].name}`);
            } else {
                showToast("Tất cả người chơi đã nhận bài! Quản trò có thể bắt đầu điều phối game 🌙");
                toggleModeratorPanel();
            }
        }

        function prevPlayer() {
            if (currentPlayerIndex > 0) {
                currentPlayerIndex--;
                loadPlayerTurn();
            }
        }

        function toggleModeratorPanel() {
            const content = document.getElementById("moderatorContent");
            const chevron = document.getElementById("modChevron");
            content.classList.toggle("hidden");
            chevron.classList.toggle("rotate-180");
        }

        function buildModeratorList() {
            const list = document.getElementById("modPlayerList");
            list.innerHTML = "";
            assignedGameData.forEach((p, idx) => {
                const div = document.createElement("div");
                div.className = "flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200";
                div.innerHTML = `
                    <span class="font-bold text-gray-800">${idx + 1}. ${p.name}</span>
                    <span class="px-2.5 py-0.5 rounded-lg bg-lightOrange text-darkOrange font-semibold">${p.role}</span>
                `;
                list.appendChild(div);
            });
        }

        function revealAllRoles() {
            if (confirm("Bạn có chắc chắn muốn lật toàn bộ vai trò để công bố kết quả trận đấu không?")) {
                let html = "<h4 class='font-bold text-sm text-gray-900 mb-2'>📋 KẾT QUẢ VÁN ĐẤU:</h4>";
                assignedGameData.forEach(p => {
                    html += `<div class='p-2 mb-1 bg-lightOrange/60 rounded-xl text-xs flex justify-between'><strong>${p.name}</strong> <span class='font-bold text-darkOrange'>${p.role}</span></div>`;
                });
                
                const winModal = document.createElement("div");
                winModal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4";
                winModal.innerHTML = `
                    <div class="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-4">
                        <div class="w-16 h-16 bg-lightOrange text-darkOrange rounded-full flex items-center justify-center text-2xl mx-auto shadow-inner">
                            <i class="fa-solid fa-trophy"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900">Tổng kết vai trò ván đấu</h3>
                        <div class="max-h-60 overflow-y-auto text-left">${html}</div>
                        <button onclick="this.parentElement.parentElement.remove()" class="w-full py-3 rounded-2xl bg-gradient-to-r from-softOrange to-darkOrange text-white font-bold text-sm shadow-md">Đóng bảng tổng kết</button>
                    </div>
                `;
                document.body.appendChild(winModal);
            }
        }

        function resetGame() {
            if (confirm("Bạn có muốn reset game, xóa toàn bộ phân vai cũ và cấu hình lại từ đầu không?")) {
                localStorage.removeItem("coreSixMaSoiGame");
                document.getElementById("gameplayPanel").classList.remove("flex");
                document.getElementById("gameplayPanel").classList.add("hidden");
                document.getElementById("configPanel").classList.remove("hidden");
                showToast("Đã reset game thành công! 🔄");
            }
        }

        function switchMainTab(tab) {
            const btnSetup = document.getElementById("btnTabSetup");
            const btnRoles = document.getElementById("btnTabRoles");
            const tabSetup = document.getElementById("tabSetupContent");
            const tabRoles = document.getElementById("tabRolesContent");

            if (tab === 'setup') {
                btnSetup.className = "flex-1 py-2 text-xs font-bold rounded-xl transition bg-white text-sageDark shadow-md flex items-center justify-center gap-1.5";
                btnRoles.className = "flex-1 py-2 text-xs font-bold rounded-xl transition text-gray-600 hover:text-sageDark flex items-center justify-center gap-1.5";
                tabSetup.classList.remove("hidden");
                tabRoles.classList.add("hidden");
            } else {
                btnRoles.className = "flex-1 py-2 text-xs font-bold rounded-xl transition bg-white text-sageDark shadow-md flex items-center justify-center gap-1.5";
                btnSetup.className = "flex-1 py-2 text-xs font-bold rounded-xl transition text-gray-600 hover:text-sageDark flex items-center justify-center gap-1.5";
                tabRoles.classList.remove("hidden");
                tabSetup.classList.add("hidden");
            }
        }

        function showToast(message) {
            const toast = document.getElementById("toast");
            toast.textContent = message;
            toast.classList.remove("opacity-0");
            setTimeout(() => {
                toast.classList.add("opacity-0");
            }, 2300);
        }

        window.addEventListener("DOMContentLoaded", () => {
            initSetup();
            const saved = localStorage.getItem("coreSixMaSoiGame");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.active && parsed.data) {
                        currentSelectedCount = parsed.count;
                        assignedGameData = parsed.data;
                        showGameplayPanel();
                        showToast("Đã khôi phục trạng thái ván đấu đang chơi! 🐺🔥");
                    }
                } catch(e) {}
            }
        });