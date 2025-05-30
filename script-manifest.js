document.addEventListener("DOMContentLoaded", () => {
    const squadContainer = document.getElementById("squadContainer");
    const totalSquadWeightDisplay = document.getElementById("totalSquadWeight");
    const toggleAllBtn = document.getElementById("toggleAll");
    const generateManifestBtn = document.getElementById("generateManifest");
    const copyManifestBtn = document.getElementById("copyManifest");
    const manifestOutput = document.getElementById("manifestOutput");
    const gearList = document.getElementById("gearList");
    


    let squads = JSON.parse(localStorage.getItem("squads")) || {
        alpha: [0, 0, 0, 0, 0],
        bravo: [0, 0, 0, 0, 0],
        charlie: [0, 0, 0, 0, 0],
        delta: [0, 0, 0, 0, 0]
    };

    let selectedMembers = JSON.parse(localStorage.getItem("selectedMembers")) || {
        alpha: [false, false, false, false, false],
        bravo: [false, false, false, false, false],
        charlie: [false, false, false, false, false],
        delta: [false, false, false, false, false]
    };

    // Hardcoded gear list inside JavaScript
    let gearItems = JSON.parse(localStorage.getItem("gearItems")) || [
        { name: "60 GAL STILLWELL, EMPTY", weight: 11, amount: 0 },
        { name: "BLADDER, 1500 GAL, EMPTY", weight: 57, amount: 0 },
        { name: "BLADDER, 2500 GAL, EMPTY", weight: 100, amount: 0 },
        { name: "BOX OF WATER", weight: 30, amount: 0 },
        { name: "CHAINSAW", weight: 0, amount: 0 },
        { name: "DRIPT TORCH, EMPTY", weight: 5, amount: 0 },
        { name: "FUEL, 5 GAL SCEPTRE", weight: 41, amount: 0 },
        { name: "FUEL, 1 GAL SCEPTRE", weight: 9, amount: 0 },
        { name: "FUEL, COMBI CAN", weight: 17, amount: 0 },
        { name: "FUEL, 5 GAL SCEPTRE, EMPTY", weight: 5, amount: 0 },
        { name: "FUEL, 1 GAL SCEPTRE, EMPTY", weight: 2, amount: 0 },
        { name: "FUEL, COMBI CAN, EMPTY", weight: 3, amount: 0 },
        { name: "HAND TOOLS, SHOVEL", weight: 5, amount: 0 },
        { name: "HAND TOOLS, PULASKI", weight: 6, amount: 0 },
        { name: "HOSE, 1 1/2\", DRY", weight: 13, amount: 0 },
        { name: "HOSE, BIG INCH, DRY", weight: 8, amount: 0 },
        { name: "HOSE, ECONO 5/8\", DRY", weight: 1.5, amount: 0 },
        { name: "DEMOBED HOSE, 1 1/2\", WET", weight: 15, amount: 0 },
        { name: "DEMOBED HOSE, BIG INCH, WET", weight: 13, amount: 0 },
        { name: "DEMOBED HOSE, ECONO 5/8\", WET", weight: 2, amount: 0 },
        { name: "KIT, FIRST AID, LEVEL 3, NO OXYGEN", weight: 14, amount: 0 },
        { name: "KIT OXYGEN", weight: 14, amount: 0 },
        { name: "PUMP MARK III W/ BACKBOARD", weight: 67, amount: 0 },
        { name: "PUMP MARK 26 W/ BACKBOARD", weight: 44, amount: 0 },
        { name: "PUMP 2 1/2\" SUCTION HOSE W/ FOOT VALVE", weight: 14, amount: 0 },
        { name: "PUMP TOOL KIT COMPLETE", weight: 31, amount: 0 },
        { name: "PUMP MARK III COMPLETE, NO FUEL", weight: 114, amount: 0 }
    ];


    function renderSquad(squadName) {
        const squadSection = document.querySelector(`[data-squad="${squadName}"] .squad-content`);
        squadSection.innerHTML = `<table>
            <thead>
                <tr>
                    <th>Member</th>
                    <th>Weight (lbs)</th>
                    <th>Include</th>
                </tr>
            </thead>
            <tbody id="squadList-${squadName}">
            </tbody>
        </table>`;

        const squadList = document.getElementById(`squadList-${squadName}`);
        squads[squadName].forEach((weight, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${squadName.toUpperCase()}${index + 1}</td>
                <td><input type="number" value="${weight}" min="0" data-squad="${squadName}" data-index="${index}"></td>
                <td><input type="checkbox" data-squad="${squadName}" data-index="${index}" ${selectedMembers[squadName][index] ? "checked" : ""}></td>
            `;
            squadList.appendChild(row);
        });

        document.querySelectorAll(`#squadList-${squadName} input[type='number']`).forEach((input) => {
            input.addEventListener("input", (event) => {
                const squad = event.target.dataset.squad;
                const index = event.target.dataset.index;
                squads[squad][index] = Number(event.target.value) || 0;
                localStorage.setItem("squads", JSON.stringify(squads));
                updateTotalSquadWeight();
            });
        });

        document.querySelectorAll(`#squadList-${squadName} input[type='checkbox']`).forEach((checkbox) => {
            checkbox.addEventListener("change", (event) => {
                const squad = event.target.dataset.squad;
                const index = event.target.dataset.index;
                selectedMembers[squad][index] = event.target.checked;
                localStorage.setItem("selectedMembers", JSON.stringify(selectedMembers));
                updateTotalSquadWeight();
            });
        });

        updateTotalSquadWeight();
    }

    function updateTotalSquadWeight() {
        let totalWeight = 0;
        Object.keys(squads).forEach((squad) => {
            squads[squad].forEach((weight, index) => {
                if (selectedMembers[squad][index]) {
                    totalWeight += weight;
                }
            });
        });
        totalSquadWeightDisplay.textContent = totalWeight;
    }

    function updateGearTable() {
        gearList.innerHTML = ""; 

        gearItems.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.weight} lbs</td>
                <td><input type="number" value="${item.amount}" min="0" data-index="${index}"></td>
                <td class="total-weight">${item.weight * item.amount} lbs</td>
            `;
            gearList.appendChild(row);
        });

        document.querySelectorAll("#gearList input").forEach((input) => {
            input.addEventListener("input", (event) => {
                const index = event.target.dataset.index;
                gearItems[index].amount = Number(event.target.value) || 0;
                localStorage.setItem("gearItems", JSON.stringify(gearItems));
                updateGearTable();
            });
        });
    }

    document.querySelectorAll(".squad-header").forEach((header) => {
        header.addEventListener("click", () => {
            const squadName = header.parentElement.dataset.squad;
            const squadContent = header.nextElementSibling;
            squadContent.style.display = squadContent.style.display === "none" ? "block" : "none";
            header.classList.toggle("open");
        });
    });

    toggleAllBtn.addEventListener("click", () => {
        document.querySelectorAll(".squad-content").forEach((content) => {
            content.style.display = content.style.display === "none" ? "block" : "none";
        });
        document.querySelectorAll(".squad-header").forEach((header) => {
            header.classList.toggle("open");
        });
    });

    generateManifestBtn.addEventListener("click", () => {
        let manifestText = "Helicopter Manifest:\n";
        Object.keys(squads).forEach((squad) => {
            squads[squad].forEach((weight, index) => {
                if (selectedMembers[squad][index]) {
                    manifestText += `${squad.toUpperCase()}${index + 1}: ${weight} lbs\n`;
                }
            });
        });

        const totalSquadWeight = Object.keys(squads).reduce((total, squad) => {
            return total + squads[squad].reduce((sum, weight, index) => sum + (selectedMembers[squad][index] ? weight : 0), 0);
        }, 0);

        const totalGearWeight = gearItems.reduce((sum, item) => sum + item.weight * item.amount, 0);
        const totalWeight = totalSquadWeight + totalGearWeight;

        manifestText += `Squad Weight: ${totalSquadWeight} lbs\nGear Weight: ${totalGearWeight} lbs\nTotal Weight: ${totalWeight} lbs`;
        manifestOutput.value = manifestText;
    });

    copyManifestBtn.addEventListener("click", () => {
        manifestOutput.select();
        document.execCommand("copy");
    });

    Object.keys(squads).forEach((squad) => renderSquad(squad));
    updateGearTable();
});


