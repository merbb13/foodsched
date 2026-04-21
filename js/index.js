 function generateSchedule() {
            const file = document.getElementById('fileInput').files[0];
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(document.getElementById('endDate').value);
            const output = document.getElementById('output');

            if (!file) {
                alert("Upload a .txt file first");
                return;
            }

            if (isNaN(startDate) || isNaN(endDate)) {
                alert("Please select valid dates");
                return;
            }

            if (startDate > endDate) {
                alert("Start date must be before end date");
                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                const names = e.target.result
                    .split("\n")
                    .map(n => n.trim())
                    .filter(n => n);

                const schedule = buildSchedule(names, startDate, endDate);
                output.textContent = schedule;
            };

            reader.readAsText(file);
        }

        function buildSchedule(names, startDate, endDate) {
            const meals = ["BREAKFAST", "LUNCH", "DINNER", "MIDNIGHT SNACK"];
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            let result = "FOOD SCHEDULE FOR GUARD\n\n";
            let currentDate = new Date(startDate);
            let nameIndex = 0;

            while (currentDate <= endDate) {
                const month = monthNames[currentDate.getMonth()];
                const day = currentDate.getDate();

                result += `${month} ${day}\n`;

                meals.forEach(meal => {
                    const person = names[nameIndex % names.length];
                    result += `${meal} - ${person}\n`;
                    nameIndex++;
                });

                result += "\n";

                currentDate.setDate(currentDate.getDate() + 1);
            }

            return result.trim();
        }

        function downloadTXT() {
            const content = document.getElementById("output").textContent;

            if (!content) {
                alert("No schedule to download.");
                return;
            }

            const blob = new Blob([content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;

            // 📅 Dynamic filename
            const today = new Date();
            const formattedDate = today.toISOString().slice(0, 10);

            a.download = `schedule_${formattedDate}.txt`;
            a.click();

            URL.revokeObjectURL(url);
        }

        function copyToClipboard() {
            const content = document.getElementById("output").textContent;

            if (!content) {
                alert("Nothing to copy.");
                return;
            }

            navigator.clipboard.writeText(content)
                .then(() => {
                    alert("Copied to clipboard!");
                })
                .catch(err => {
                    console.error(err);
                    alert("Failed to copy.");
                });
        }